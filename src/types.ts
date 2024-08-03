import { Logger } from "chainsauce";
import abis from "./indexer/abis/index.js";

export { Address } from "./address.js";

export enum EUserRole {
  ADMIN,
  COVER_BUYER,
  LIQUIDITY_PROVIDER,
}

export type Hex = `0x${string}`;

import type { FetchOptions } from "make-fetch-happen";
import type { Response } from "node-fetch";

export type baseLogger = Logger;

export type FetchInterface = (
  uri: string,
  opts?: FetchOptions,
) => Promise<Response>;

export type ChainId = number;
export type CoingeckoSupportedChainId = 1 | 8453;

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
