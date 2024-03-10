import { Indexer as ChainsauceIndexer } from "chainsauce";
import { Logger } from "pino";
import { Abi, PublicClient } from "viem";
import { Database } from "../database/index.js";
import { PriceProvider } from "../prices/provider.js";


export interface EventHandlerContext {
  chainId: number;
  db: Database;
  rpcClient: PublicClient;
  ipfsGet: <T>(cid: string) => Promise<T> | undefined;
  priceProvider: PriceProvider;
  logger: Logger;
}

export type Indexer = ChainsauceIndexer<Record<string, Abi>, EventHandlerContext>;