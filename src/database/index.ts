import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  ValueExpression,
  sql,
} from "kysely";
import { LRUCache } from "lru-cache";
import { Pool } from "pg";
import { Logger } from "pino";
import { v4 as uuidv4 } from "uuid";
import { Address } from "../address.js";
import { ChainId } from "../types.js";
import { DataChange } from "./changeset.js";
import { migrate } from "./migrate.js";
import {
  PriceTable,
  RoleTable,
  TransferTable,
  UserRewardsTable,
  UserTable,
} from "./schema.js";

export type { DataChange as Changeset };

interface Tables {
  users: UserTable;
  prices: PriceTable;
  userRewards: UserRewardsTable;
  transfers: TransferTable;
  roles: RoleTable;
}

type KyselyDb = Kysely<Tables>;

const UPDATE_STATS_EVERY_MS = 60_000;

export class Database {
  #db: KyselyDb;
  #roundMatchTokenCache = new LRUCache<string, Address>({ max: 500 });
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

    // this.schedulePolicyQueueFlush();
  }

  // private schedulePolicyQueueFlush() {
  //   if (this.#policyBatchTimeout !== null) {
  //     clearTimeout(this.#policyBatchTimeout);
  //   }

  //   this.#policyBatchTimeout = setTimeout(() => {
  //     this.flushPolicyQueue();
  //   }, UPDATE_STATS_EVERY_MS);
  // }

  // private async flushPolicyQueue() {
  //   const policies = this.#policyQueue.splice(0, this.#policyQueue.length);

  //   if (policies.length === 0) {
  //     return;
  //   }

  //   // chunk policies into batches of 1k to void hitting the 65k parameter limit
  //   // https://github.com/brianc/node-postgres/issues/1463
  //   const chunkSize = 1_000;
  //   const chunks = [];

  //   for (let i = 0; i < policies.length; i += chunkSize) {
  //     chunks.push(policies.slice(i, i + chunkSize));
  //   }

  //   for (const chunk of chunks) {
  //     await this.applyChange({
  //       type: "InsertManyDonations",
  //       policies: chunk,
  //     });
  //   }
  // }

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

      await migrate(tx, this.databaseSchemaName);
    });
  }

  generateUuid() {
    return uuidv4() as ValueExpression<
      Tables,
      "transfers",
      `${string}-${string}-${string}-${string}-${string}`
    >;
  }

  async applyChanges(changes: any[]): Promise<void> {
    for (const change of changes) {
      await this.applyChange(change);
    }
  }

  async applyChange(change: any): Promise<void> {
    switch (change.type) {
      case "InsertTransfer":
        await this.#db
          .insertInto("transfers")
          .values({
            ...change.transfer,
          })
          .executeTakeFirst();
        break;

      default:
        throw new Error(`unsupported change type: ${change.type}`);
    }
  }

  async getTokenPriceByBlockNumber(
    chainId: ChainId,
    tokenAddress: Address,
    blockNumber: bigint | "latest",
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
