import { Kysely, sql } from "kysely";

// enough to hold 256 bit integers
const BIGINT_TYPE = sql`decimal(78,0)`;
const ADDRESS_TYPE = "text";
const CHAIN_ID_TYPE = "integer";
const ROLE_TYPE = "text";

export async function migrate<T>(db: Kysely<T>, schemaName: string) {
  const ref = (name: string) => sql.table(`${schemaName}.${name}`);

  const schema = db.withSchema(schemaName).schema;

  await schema
    .createTable("users")
    .addColumn("id", "uuid")
    .addColumn("address", ADDRESS_TYPE)
    .addColumn("name", "text")
    .addColumn("email", "text")
    .addColumn("userRole", ROLE_TYPE)
    .addColumn("createdAt", BIGINT_TYPE)
    .addColumn("updatedAt", BIGINT_TYPE)

    .addPrimaryKeyConstraint("users_pkey", ["id"])
    .execute();

  await schema
    .createTable("transfers")
    .addColumn("id", "text")
    .addColumn("from", ADDRESS_TYPE)
    .addColumn("to", ADDRESS_TYPE)
    .addColumn("amount", BIGINT_TYPE)
    .addColumn("transfered_at", BIGINT_TYPE)
    .addColumn("block_number", BIGINT_TYPE)

    .addPrimaryKeyConstraint("transfers_pkey", ["id"])

    .execute();

  await schema
    .createTable("wos")
    .addColumn("id", "uuid")
    .addColumn("chainId", CHAIN_ID_TYPE)
    .addColumn("timestamp", "timestamp")
    .addColumn("blockNumber", BIGINT_TYPE)

    .addPrimaryKeyConstraint("wos_pkey", ["id"])

    .execute();

  await schema
    .createTable("signed_positions")
    .addColumn("id", "uuid")
    .addColumn("chainId", CHAIN_ID_TYPE)
    .addColumn("timestamp", "timestamp")
    .addColumn("blockNumber", BIGINT_TYPE)
    .addColumn("maxRisk", BIGINT_TYPE)
    .addColumn("stakeAmount", BIGINT_TYPE)
    .addColumn("rateEstimate", BIGINT_TYPE)

    .addPrimaryKeyConstraint("signed_positions_pkey", ["id"])

    .execute();

  await schema
    .createTable("signed_policies")
    .addColumn("id", "uuid")
    .addColumn("chainId", CHAIN_ID_TYPE)
    .addColumn("timestamp", "timestamp")
    .addColumn("blockNumber", BIGINT_TYPE)
    .addColumn("minCover", BIGINT_TYPE)
    .addColumn("premium", BIGINT_TYPE)
    .addColumn("rateEstimate", BIGINT_TYPE)
    .addColumn("lengthOfCover", BIGINT_TYPE)

    .addPrimaryKeyConstraint("signed_policies_pkey", ["id"])

    .execute();

  await schema
    .createTable("user_rewards")
    .addColumn("id", "uuid")
    .addColumn("chainId", CHAIN_ID_TYPE)
    .addColumn("timestamp", BIGINT_TYPE)
    .addColumn("blockNumber", BIGINT_TYPE)
    .addColumn("user", ADDRESS_TYPE)
    .addColumn("reward", BIGINT_TYPE)

    .addPrimaryKeyConstraint("user_rewards_pkey", ["id"])

    .execute();

  await schema
    .createTable("prices")
    .addColumn("id", "uuid")
    .addColumn("chainId", CHAIN_ID_TYPE)
    .addColumn("timestamp", "timestamp")
    .addColumn("blockNumber", BIGINT_TYPE)
    .addColumn("tokenAddress", ADDRESS_TYPE)
    .addColumn("price", BIGINT_TYPE)

    .addPrimaryKeyConstraint("prices_pkey", ["id"])

    .execute();

  await schema
    .createTable("roles")
    .addColumn("id", "text")
    .addColumn("user", ADDRESS_TYPE)
    .addColumn("role", "text")
    .addColumn("created_at", BIGINT_TYPE)
    .addColumn("updated_at", BIGINT_TYPE)

    .addPrimaryKeyConstraint("roles_pkey", ["id"])

    .execute();

  await schema
    .createTable("user_roles")
    .addColumn("id", "uuid")
    .addColumn("userId", "uuid")
    .addColumn("roleId", "uuid")

    .addPrimaryKeyConstraint("user_roles_pkey", ["id"])

    .execute();

  await schema
    .createTable("contracts")
    .addColumn("id", "uuid")
    .addColumn("name", "text")
    .addColumn("address", ADDRESS_TYPE)

    .addPrimaryKeyConstraint("contracts_pkey", ["id"])

    .execute();
}

// https://www.graphile.org/postgraphile/smart-tags/
// https://www.graphile.org/postgraphile/computed-columns/
