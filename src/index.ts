import {
  Abi,
  createHttpRpcClient,
  createIndexer,
  createPostgresSubscriptionStore,
} from "chainsauce";
import { IndexerEvents } from "chainsauce/dist/indexer.js";
import "dotenv/config";
import * as pg from "pg";
import { pino } from "pino";
import { throttle } from "throttle-debounce";
import { Config, getConfig } from "./config.js";
import { Changeset, Database } from "./database/index.js";
import abis from "./indexer/abis/index.js";
import { handleEvent } from "./indexer/handleEvent.js";
const { Pool, types } = pg.default;

// const { Pool, types } = pg.default;
// const RESOURCE_MONITOR_INTERVAL_MS = 1 * 60 * 1000; // every minute
const config = getConfig();

const rpcClient = createHttpRpcClient({
  retryDelayMs: 1000,
  maxConcurrentRequests: 10,
  maxRetries: 3,
  url: config.chains[0].rpc,
  onRequest({ method, params }) {
    console.log(`RPC Request ${method}`, params);
  },
});

async function main(): Promise<void> {
  console.log("Hello, Pharo indexing folks!");

  const baseLogger = pino({
    level: config.logLevel,
    formatters: {
      level(level) {
        // represent severity as strings so that DataDog can recognize it
        return { level };
      },
    },
  }).child({
    service: "indexer-development",
  });

  const databaseConnectionPool = new Pool({
    connectionString: config.databaseUrl,
    // Maximum number of connections in the pool
    max: 15,

    // Maximum number of milliseconds a client in the pool is allowed to be idle before it is closed
    idleTimeoutMillis: 30_000,

    // Maximum number of milliseconds to wait for acquiring a client from the pool
    connectionTimeoutMillis: 5_000,
  });

  const db = new Database({
    connectionPool: databaseConnectionPool,
    schemaName: config.databaseSchemaName,
  });

  const indexer = createIndexer({
    contracts: abis as Record<string, Abi>,
    chain: {
      id: 421614,
      rpcClient: createHttpRpcClient({
        url: process.env.ARBITRUM_SEPOLIA_RPC_URL as string,
      }),
    },
    logLevel: "trace",
  });

  if (config.dropDb) {
    console.info("dropping schema");

    await db.dropSchemaIfExists();
  }

  await db.createSchemaIfNotExists(baseLogger);

  const subscriptionStore = createPostgresSubscriptionStore({
    pool: databaseConnectionPool,
    schema: config.databaseSchemaName,
  });

  await subscriptionStore.init();

  const fromBlock =
    config.fromBlock === "latest"
      ? await rpcClient.getLastBlockNumber()
      : config.fromBlock;

  for (const subscription of config.chains[0].subscriptions) {
    const contractName = subscription.contractName;
    const subscriptionFromBlock =
      subscription.fromBlock === undefined
        ? undefined
        : BigInt(subscription.fromBlock);

    indexer.subscribeToContract({
      contract: contractName,
      address: subscription.address,
      fromBlock:
        subscriptionFromBlock !== undefined && subscriptionFromBlock > fromBlock
          ? subscriptionFromBlock
          : fromBlock,
    });
  }

  indexer.on("event", async (args) => {
    await handleEvent(args)
      .then(async (changeset: Changeset[]) => {
        await db.applyChanges(changeset);
      })
      .catch((err: unknown) => {
        console.warn({
          msg: "error while processing event",
          err,
        });
      });
  });

  indexer.on(
    "progress",
    throttle<IndexerEvents["progress"]>(
      5000,
      ({ currentBlock, targetBlock, pendingEventsCount }) => {
        const progressPercentage = (
          (Number(currentBlock) / Number(targetBlock)) *
          100
        ).toFixed(1);

        const subscriptions = indexer.getSubscriptions();

        const activeSubscriptions = subscriptions.filter((sub) => {
          return sub.toBlock === "latest" || sub.toBlock < targetBlock;
        });

        console.info(
          `${currentBlock}/${targetBlock} indexed (${progressPercentage}%) (pending events: ${pendingEventsCount}) (contracts: ${activeSubscriptions.length})`
        );
      }
    )
  );

  await indexer.indexToBlock(config.toBlock);

  console.info({
    msg: "caught up with blockchain events",
    toBlock: config.toBlock,
  });

  catchupAndWatchChain({
    ...config,
  });

  // -- One off indexing:

  // one off indexing, this will resolve when finished or reject if any error happens
  // await indexer.indexToBlock("latest");

  // -- Continous indexing:

  // indexes to the latest block and watches the chain for new events
  // until stopped with `indexer.stop()`
  // errors will be emitted and will not stop indexing
  indexer.on("error", (error) => {
    console.error("whoops", error);
  });

  indexer.watch();
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function catchupAndWatchChain(config: Omit<Config, "chains"> & {}) {}
