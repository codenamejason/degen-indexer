// import { ToBlock } from "chainsauce";
import { Logger } from "chainsauce";
import "dotenv/config";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { z } from "zod";
import abis from "./indexer/abis/index.js";
import { Hex } from "./types.js";

type ChainId = number;
type CoingeckoSupportedChainId = 1 | 421614;

const CHAIN_DATA_VERSION = "33";

export type Token = {
  code: string;
  address: string;
  decimals: number;
  priceSource: { chainId: CoingeckoSupportedChainId; address: string };
  voteAmountCap?: bigint;
};

export type Subscription = {
  address: Hex;
  contractName: keyof typeof abis;
  fromBlock?: number;
  eventsRenames?: Record<string, string>;
};

export type Chain = {
  rpc: string;
  name: string;
  id: ChainId;
  pricesFromTimestamp: number;
  tokens: Token[];
  subscriptions: Subscription[];
  maxGetLogsRange?: number;
};

const rpcUrl = z.string().url();

export type baseLogger = Logger;

const CHAINS: Chain[] = [
  {
    id: 421614,
    name: "arbitrum-sepolia",
    rpc: rpcUrl
      .default("https://arb-sepolia.g.alchemy.com/v2/")
      .parse(process.env.ARBITRUM_SEPOLIA_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 7, 1, 0, 0, 0),
    tokens: [
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 421614,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
    ],
    subscriptions: [
      {
        contractName: "PharoV2/PharoToken",
        address: "0xB4204ecc047F026ABfC3B5794cFDBF7dAC7C4C9E",
        fromBlock: 21512000,
      },
      {
        contractName: "PharoV2/PharoReservePool",
        address: "0xe9C7726146647cfF567078ee233C9aeE031A3260",
        fromBlock: 21512000,
      },
      {
        contractName: "PharoV2/PharoRiskPool",
        address: "0xeb57e57dB924A052A2338E7FB9fBF8Fa40b589D3",
        fromBlock: 21512000,
      },
      {
        contractName: "PharoV2/PharoPhinance",
        address: "0x6B914a417C2640eeca34829Bf303Af2604829A03",
        fromBlock: 21512000,
      },
      {
        contractName: "PharoV2/PharoCover",
        address: "0x9107873027cD892eCB127D7AE978A82610F7aB86",
        fromBlock: 21512000,
      },
      {
        contractName: "PharoV2/PharoMarket",
        address: "0x34508Cb1b4aFA25Fb6f1aCb25180A48aC2Cae0A1",
        fromBlock: 21512000,
      },
      {
        contractName: "PharoV2/PharoRewards",
        address: "0x630ab9f5D44d2e5aca744Bfad644A4bBb426836A",
        fromBlock: 21512000,
      },
    ],
  },
  {
    id: 80001,
    name: "polygon-mumbai",
    rpc: rpcUrl
      .default("https://rpc-mumbai.maticvigil.com/")
      .parse(process.env.POLYGON_MUMBAI_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 8, 19, 0, 0, 0),
    tokens: [
      {
        code: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        },
      },
      {
        code: "USDC",
        address: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 137,
    name: "polygon",
    rpc: rpcUrl
      .default("https://polygon-rpc.com")
      .parse(process.env.POLYGON_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 8, 19, 0, 0, 0),
    tokens: [
      {
        code: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        },
      },
      {
        code: "USDC",
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 8453,
    name: "base",
    rpc: rpcUrl
      .default("https://mainnet.base.org/")
      .parse(process.env.BASE_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 12, 1, 0, 0, 0),
    tokens: [
      {
        code: "USDC",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
      },
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 84532,
    name: "base-sepolia",
    rpc: rpcUrl
      .default("https://sepolia.base.org")
      .parse(process.env.BASE_SEPOLIA_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 12, 1, 0, 0, 0),
    tokens: [
      {
        code: "USDC",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
      },
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 324,
    name: "zksync-era-mainnet",
    rpc: rpcUrl
      .default("https://mainnet.era.zksync.io")
      .parse(process.env.ZKSYNC_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 12, 1, 0, 0, 0),
    tokens: [
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
      {
        code: "USDC",
        address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
      },
      {
        code: "USDT",
        address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        },
      },
      {
        code: "DAI",
        address: "0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        },
      },
      {
        code: "LUSD",
        address: "0x503234F203fC7Eb888EEC8513210612a43Cf6115",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 280,
    name: "zksync-era-testnet",
    rpc: rpcUrl
      .default("https://testnet.era.zksync.dev")
      .parse(process.env.ZKSYNC_TESTNET_RPC_URL),
    pricesFromTimestamp: Date.UTC(2023, 12, 1, 0, 0, 0),
    tokens: [
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 534351,
    name: "scroll-sepolia",
    rpc: rpcUrl
      .default("https://sepolia-rpc.scroll.io")
      .parse(process.env.SCROLL_SEPOLIA_RPC_URL),
    pricesFromTimestamp: Date.UTC(2024, 0, 1, 0, 0, 0),
    maxGetLogsRange: 2000,
    tokens: [
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
    ],
    subscriptions: [],
  },
  {
    id: 534352,
    name: "scroll",
    rpc: rpcUrl
      .default("https://rpc.scroll.io")
      .parse(process.env.SCROLL_RPC_URL),
    pricesFromTimestamp: Date.UTC(2024, 0, 1, 0, 0, 0),
    tokens: [
      {
        code: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        priceSource: {
          chainId: 1,
          address: "0x0000000000000000000000000000000000000000",
        },
      },
      {
        code: "USDC",
        address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
        decimals: 6,
        priceSource: {
          chainId: 1,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
      },
    ],
    subscriptions: [],
  },
];

export const getDecimalsForToken = (
  chainId: ChainId,
  tokenAddress: string
): number => {
  const chain = CHAINS.find((c) => c.id === chainId);
  if (chain === undefined) {
    throw new Error(`No such chain: ${chainId}`);
  }

  const token = chain.tokens.find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  if (token === undefined) {
    throw new Error(
      `No such token: ${tokenAddress} configured for chain ${chainId}`
    );
  }

  return token.decimals;
};

export const getChainConfigById = (chainId: ChainId): Chain => {
  const chain = CHAINS.find((c) => c.id === chainId);
  if (chain === undefined) {
    throw new Error(`Chain not configured: ${chainId}`);
  }
  return chain;
};

export type Config = {
  buildTag: string | null;
  storageDir: string;
  cacheDir: string | null;
  fromBlock: bigint | "latest";
  toBlock: any;
  logLevel: "trace" | "debug" | "info" | "warn" | "error";
  httpServerWaitForSync: boolean;
  ipfsGateway: string;
  coingeckoApiKey: string | null;
  coingeckoApiUrl: string;
  chains: Chain[];
  runOnce: boolean;
  // apiHttpPort: number;
  sentryDsn: string | null;
  databaseUrl: string;
  databaseSchemaName: string;
  hostname: string;
  // deploymentEnvironment: "local" | "development" | "staging" | "production";
  // enableResourceMonitor: boolean;
  dropDb: boolean;
  estimatesLinearQfWorkerPoolSize: number | null;
};

export function getConfig(): Config {
  const buildTag = z
    .union([z.string(), z.null()])
    .default(null)
    .parse(process.env.BUILD_TAG);

  // const enableResourceMonitor = z
  //   .enum(["true", "false"])
  //   .transform((value) => value === "true")
  //   .parse(process.env.ENABLE_RESOURCE_MONITOR);

  // const apiHttpPort = z.coerce.number().parse(process.env.PORT);

  // const deploymentEnvironment = z
  //   .union([
  //     z.literal("local"),
  //     z.literal("development"),
  //     z.literal("staging"),
  //     z.literal("production"),
  //   ])
  //   .parse(process.env.DEPLOYMENT_ENVIRONMENT);

  const coingeckoApiKey = z
    .union([z.string(), z.null()])
    .default(null)
    .parse(process.env.COINGECKO_API_KEY);

  const coingeckoApiUrl =
    coingeckoApiKey === null
      ? "https://api.coingecko.com/api/v3"
      : "https://pro-api.coingecko.com/api/v3/";

  const storageDir = z
    .string()
    .default("./.var")
    .parse(process.env.STORAGE_DIR);

  const cacheDir = z
    .union([z.string(), z.null()])
    .default(path.join(storageDir, "cache"))
    .parse(process.env.CACHE_DIR);

  const { values: args } = parseArgs({
    options: {
      "to-block": {
        type: "string",
      },
      "from-block": {
        type: "string",
      },
      "drop-db": {
        type: "boolean",
      },
      "log-level": {
        type: "string",
      },
      "run-once": {
        type: "boolean",
      },
      "no-cache": {
        type: "boolean",
      },
      "http-wait-for-sync": {
        type: "string",
      },
    },
  });

  const chains = z
    .string()
    .parse(process.env.INDEXED_CHAINS)
    .split(",")
    .map((chainName) => {
      const c = CHAINS.find((chain) => chain.name === chainName);
      if (c === undefined) {
        throw new Error(`Chain ${chainName} not configured`);
      }
      return c;
    });

  const toBlock = z
    .literal("latest")
    .or(z.coerce.bigint())
    .default("latest")
    .parse(args["to-block"]);

  const fromBlock = z
    .literal("latest")
    .or(z.coerce.bigint())
    .default(0n)
    .parse(args["from-block"]);

  const logLevel = z
    .union([
      z.literal("trace"),
      z.literal("debug"),
      z.literal("info"),
      z.literal("warn"),
      z.literal("error"),
    ])
    .default("info")
    .parse(args["log-level"] ?? process.env.LOG_LEVEL);

  const runOnce = z.boolean().default(false).parse(args["run-once"]);

  const ipfsGateway = z
    .string()
    .default("https://ipfs.io")
    .parse(process.env.IPFS_GATEWAY);

  const sentryDsn = z
    .union([z.string(), z.null()])
    .default(null)
    .parse(process.env.SENTRY_DSN);

  const hostname = os.hostname();

  const databaseUrl = z.string().url().parse(process.env.DATABASE_URL);

  const sqlSafeHostname = hostname.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  const databaseSchemaName = `chain_data_${sqlSafeHostname}_${CHAIN_DATA_VERSION}`;

  const dropDb = z.boolean().default(false).parse(args["drop-db"]);

  const estimatesLinearQfWorkerPoolSize = z.coerce
    .number()
    .nullable()
    .default(null)
    .parse(process.env.ESTIMATES_LINEARQF_WORKER_POOL_SIZE);

  const httpServerWaitForSync = z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true")
    .parse(args["http-wait-for-sync"] ?? process.env.HTTP_SERVER_WAIT_FOR_SYNC);

  return {
    buildTag: buildTag,
    sentryDsn,
    coingeckoApiUrl,
    coingeckoApiKey,
    storageDir,
    chains,
    toBlock,
    fromBlock,
    cacheDir,
    logLevel,
    runOnce,
    ipfsGateway,
    // apiHttpPort,
    // deploymentEnvironment,
    // enableResourceMonitor,
    databaseUrl,
    dropDb,
    databaseSchemaName,
    httpServerWaitForSync,
    hostname: os.hostname(),
    estimatesLinearQfWorkerPoolSize,
  };
}
