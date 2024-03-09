import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { Address, ChainId, User } from "../types.js";

export type UserTable = User & {
  created_at: Date;
  updated_at: Date;
};

export type PolicyTable = {
  id: Generated<number>;
  chainId: ChainId;
  tokenAddress: Address;
  timestamp: Date;
  blockNumber: bigint;
};

export type NewPolicy = Insertable<PolicyTable>;

export type PriceTable = {
  id: Generated<number>;
  chainId: ChainId;
  tokenAddress: Address;
  priceInUsd: number;
  timestamp: Date;
  blockNumber: bigint;
};

export type NewPrice = Insertable<PriceTable>;
export type Price = Selectable<PriceTable>;
export type PartialPrice = Updateable<PriceTable>;
