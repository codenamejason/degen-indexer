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
}

// https://www.graphile.org/postgraphile/smart-tags/
// https://www.graphile.org/postgraphile/computed-columns/
