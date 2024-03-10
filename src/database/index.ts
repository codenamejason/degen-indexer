import { CamelCasePlugin, Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";

import { PriceTable, TNewPolicy, UserTable } from "./schema.js";

import { LRUCache } from "lru-cache";
import { Logger } from "pino";
import { Address } from "../address.js";
import { ChainId } from "../types.js";
import { DataChange } from "./changeset.js";

export type { DataChange as Changeset };

interface Tables {
  users: UserTable;
  prices: PriceTable;
}

type KyselyDb = Kysely<Tables>;

const UPDATE_STATS_EVERY_MS = 60_000;

export class Database {
  #db: KyselyDb;
  #roundMatchTokenCache = new LRUCache<string, Address>({ max: 500 });
  #policyQueue: TNewPolicy[] = [];
  #policyBatchTimeout: ReturnType<typeof setTimeout> | null = null;
  #statsTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly databaseSchemaName: string;

  constructor(options: { connectionPool: Pool; schemaName: string }) {
    const dialect = new PostgresDialect({
      pool: options.connectionPool,
    });

    this.#db = new Kysely<Tables>({
      dialect,
      plugins: [new CamelCasePlugin()],
    });

    this.#db = this.#db.withSchema(options.schemaName);

    this.databaseSchemaName = options.schemaName;

    this.schedulePolicyQueueFlush();
  }

  private schedulePolicyQueueFlush() {
    if (this.#policyBatchTimeout !== null) {
      clearTimeout(this.#policyBatchTimeout);
    }

    this.#policyBatchTimeout = setTimeout(() => {
      this.flushPolicyQueue();
    }, UPDATE_STATS_EVERY_MS);
  }

  private async flushPolicyQueue() {
    const donations = this.#policyQueue.splice(0, this.#policyQueue.length);

    if (donations.length === 0) {
      return;
    }

    // chunk donations into batches of 1k to void hitting the 65k parameter limit
    // https://github.com/brianc/node-postgres/issues/1463
    const chunkSize = 1_000;
    const chunks = [];

    for (let i = 0; i < donations.length; i += chunkSize) {
      chunks.push(donations.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      await this.applyChange({
        type: "InsertManyDonations",
        donations: chunk,
      });
    }
  }

  async dropSchemaIfExists() {
    await this.#db.schema
      .dropSchema(this.databaseSchemaName)
      .ifExists()
      .cascade()
      .execute();
  }

  async createSchemaIfNotExists(logger: Logger) {
    const exists = await sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.schemata
      WHERE schema_name = ${this.databaseSchemaName}
    )`.execute(this.#db);

    if (exists.rows.length > 0 && exists.rows[0].exists) {
      logger.info({
        msg: `schema "${this.databaseSchemaName}" exists, skipping creation`,
      });

      return;
    }

    logger.info({
      msg: `schema "${this.databaseSchemaName}" does not exist, creating schema`,
    });

    await this.#db.transaction().execute(async (tx) => {
      await tx.schema.createSchema(this.databaseSchemaName).execute();

      // await migrate(tx, this.databaseSchemaName);
    });
  }

  async applyChanges(changes: any[]): Promise<void> {
    for (const change of changes) {
      await this.applyChange(change);
    }
  }

  async applyChange(change: any): Promise<void> {}

  async getTokenPriceByBlockNumber(
    chainId: ChainId,
    tokenAddress: Address,
    blockNumber: bigint | "latest"
  ) {
    let priceQuery = this.#db
      .selectFrom("prices")
      .where("chainId", "=", chainId)
      .where("tokenAddress", "=", tokenAddress)
      .orderBy("blockNumber", "desc")
      .selectAll()
      .limit(1);

    if (blockNumber !== "latest") {
      priceQuery = priceQuery.where("blockNumber", "<=", blockNumber);
    }

    const price = await priceQuery.executeTakeFirst();

    return price ?? null;
  }

  async getAllChainPrices(chainId: ChainId) {
    return await this.#db
      .selectFrom("prices")
      .where("chainId", "=", chainId)
      .orderBy("blockNumber", "asc")
      .selectAll()
      .execute();
  }
}
