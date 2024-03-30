import { Insertable, Selectable, Updateable } from "kysely";
import { Address, ChainId } from "../types.js";

export type User = {
  address: Address;
  fid: number;
  name: string;
};

export type UserTable = User & {
  id: string;
  created_at: bigint;
  updated_at: bigint;
};

export type Status = "ACTIVE" | "INACTIVE";

export type PriceTable = {
  id: string;
  chainId: ChainId;
  tokenAddress: Address;
  priceInUsd: number;
  timestamp: Date;
  blockNumber: bigint;
};

export type UserRewards = {
  user: Address;
  reward: bigint;
};

export type UserRewardsTable = UserRewards & {
  id: string;
  blockNumber: bigint;
};

export type Transfer = {
  from: Address;
  to: Address;
  amount: bigint;
};

export type TransferTable = Transfer & {
  id: string;
  transfered_at: bigint;
  block_number: bigint;
};

export type Role = {
  user: Address;
  role: string;
};

export type RoleTable = Role & {
  id: string;
  created_at: bigint;
  updated_at: bigint;
};

export type TNewPrice = Insertable<PriceTable>;
export type TPrice = Selectable<PriceTable>;
export type TPartialPrice = Updateable<PriceTable>;
export type TNewUserRewards = Insertable<UserRewardsTable>;
export type TUserRewards = Selectable<UserRewardsTable>;
export type TPartialUserRewards = Updateable<UserRewardsTable>;
export type TNewTransfer = Insertable<TransferTable>;
export type TNewUser = Insertable<UserTable>;
export type TNewRole = Selectable<RoleTable>;
export type TRole = Selectable<RoleTable>;
export type TPartialRole = Updateable<RoleTable>;
