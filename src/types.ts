export { Address } from "./address.js";

export enum EUserRole {
  ADMIN,
  COVER_BUYER,
  LIQUIDITY_PROVIDER,
}

export type Hex = `0x${string}`;
export type ChainId = number;

import type { FetchOptions } from "make-fetch-happen";
import type { Response } from "node-fetch";

export type FetchInterface = (
  uri: string,
  opts?: FetchOptions
) => Promise<Response>;
