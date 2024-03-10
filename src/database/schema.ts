import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { Address, ChainId, User } from "../types.js";

export type UserTable = User & {
  created_at: Date;
  updated_at: Date;
};

export type Status = "ACTIVE" | "INACTIVE" | "CLOSED";

export type CoverPolicy = {
  creationDate: Date;
  policyId: number;
  owner: Address;
  status: Status;
  pharoId: number;
  coverBought: number;
  lengthOfCover: number;
  reward: number;
  premiumPaid: number;
  premium: number;
  rateEstimate: number;
  minCover: number;
};

export type LiquidityProduct = {
  providerAddress: Address;
  maximumRisk: number;
  breakevenRate: number;
  staked: number;
  asset: Address;
  premiumCollected: number;
  coverPaid: number;
  coverAvailable: number;
  reward: number;
  rateEstimate: number;
};

export type Obelisk = {
  timestamp: Date;
  pharoId: number;
  cb_wallet_id: Address[];
  cb_policy_id: number[];
  cb_preminum: number[];
  cb_reward: number[];
  cb_rate_estimate: number[];
  cb_min_cover: number[];
  cb_funds_avail: number[];
  cb_cover_bought: number[];
  cb_cover_mult: number[];
  cb_percentile: number[];
  cb_served_wallet_id: Address[][];
  cb_served_product_id: number[][];
  cb_served_value: number[][];
  cb_incompatible_LPs: number[][];
  lp_wallet_id: Address[];
  lp_product_id: number[];
  lp_stake: number[];
  lp_reward: number[];
  lp_rate_estimate: number[];
  lp_max_risk: number[];
  lp_cover_avail: number[];
  lp_breakeven_rate: number[];
  lp_served_wallet_id: Address[][];
  lp_served_policy_id: number[][];
  lp_served_value: number[][];
  lp_incompatible_CBs: number[][];
};

export type ObeliskTable = Obelisk & {
  id: Generated<number>;
  chainId: ChainId;
  timestamp: Date;
  blockNumber: bigint;
};

export type PolicyTable = CoverPolicy & {
  id: Generated<number>;
  chainId: ChainId;
  timestamp: Date;
  blockNumber: bigint;
};

export type LiquidityProductTable = LiquidityProduct & {
  id: Generated<number>;
  chainId: ChainId;
  timestamp: Date;
  blockNumber: bigint;
};

export type PriceTable = {
  id: Generated<number>;
  chainId: ChainId;
  tokenAddress: Address;
  priceInUsd: number;
  timestamp: Date;
  blockNumber: bigint;
};

// NOTE: converted from WoC to WoS (wisdom of crowds to wisdom of stakeholders)
export type WoS = {
  pharoId: number;
  alpha: number;
  beta: number;
  rateProbable: number;
  minConfidence: number;
  maxConfidence: number;
  gof: number;
  gammaX: number[];
  gammaY: number[];
};

export type WoSTable = WoS & {
  id: Generated<number>;
  chainId: ChainId;
  timestamp: Date;
  blockNumber: bigint;
};

export type SignedPosition = {
  maxRisk: number;
  stakeAmount: number;
  rateEstimate: number;
};

export type SignedPositionTable = SignedPosition & {
  id: Generated<number>;
  chainId: ChainId;
  timestamp: Date;
  blockNumber: bigint;
};

export type SignedPolicy = {
  minCover: number;
  premium: number;
  rateEstimate: number;
  lengthOfCover: number;
};

export type SignedPolicyTable = SignedPolicy & {
  id: Generated<number>;
  chainId: ChainId;
  timestamp: Date;
  blockNumber: bigint;
};

export type TNewPolicy = Insertable<PolicyTable>;
export type TPolicy = Selectable<PolicyTable>;
export type TPartialPolicy = Updateable<PolicyTable>;
export type TNewPrice = Insertable<PriceTable>;
export type TPrice = Selectable<PriceTable>;
export type TPartialPrice = Updateable<PriceTable>;
export type TNewLiquidityProduct = Insertable<LiquidityProductTable>;
export type TLiquidityProduct = Selectable<LiquidityProductTable>;
export type TPartialLiquidityProduct = Updateable<LiquidityProductTable>;
export type TNewObelisk = Insertable<ObeliskTable>;
export type TObelisk = Selectable<ObeliskTable>;
export type TPartialObelisk = Updateable<ObeliskTable>;
export type TNewWoS = Insertable<WoSTable>;
export type TWoS = Selectable<WoSTable>;
export type TPartialWoS = Updateable<WoSTable>;
export type TNewSignedPosition = Insertable<SignedPositionTable>;
export type TSignedPosition = Selectable<SignedPositionTable>;
export type TPartialSignedPosition = Updateable<SignedPositionTable>;
export type TNewSignedPolicy = Insertable<SignedPolicyTable>;
export type TSignedPolicy = Selectable<SignedPolicyTable>;
export type TPartialSignedPolicy = Updateable<SignedPolicyTable>;
