import { RpcClient } from "chainsauce/dist/rpc.js";
import { Logger } from "pino";
import { ContractName } from "./indexer/abis/index.js";
// import { Indexer } from "./indexer/indexer.js";

const CONTRACT_EXPIRATION_IN_DAYS: Partial<Record<ContractName, number>> = {
  "PharoV2/PharoToken": 60,
};

export class ContractSubscriptionPruner {
  #client: RpcClient;
  #indexer: any; //Indexer;
  #logger: Logger;

  #intervalMs = 10 * 60 * 1000; // 10 minutes

  #timer: NodeJS.Timeout | null = null;

  constructor(opts: { client: RpcClient; indexer: any; logger: Logger }) {
    this.#client = opts.client;
    this.#indexer = opts.indexer;
    this.#logger = opts.logger;
  }

  start() {
    if (this.#timer !== null) {
      throw new Error("Pruner already started");
    }

    void this.#prune();
  }

  stop() {
    if (this.#timer === null) {
      throw new Error("Pruner not started");
    }

    clearTimeout(this.#timer);
    this.#timer = null;
  }

  #scheduleNextPrune() {
    this.#timer = setTimeout(() => this.#prune(), this.#intervalMs);
  }

  async #prune(): Promise<void> {
    try {
      const subscriptions = this.#indexer.getSubscriptions();

      for (const subscription of subscriptions) {
        const expirationInDays =
          CONTRACT_EXPIRATION_IN_DAYS[
            subscription.contractName as ContractName
          ];

        if (expirationInDays === undefined) {
          continue;
        }

        const fromBlock = await this.#client.getBlockByNumber({
          number: subscription.fromBlock,
        });

        if (fromBlock === null) {
          continue;
        }

        const fromBlockDate = new Date(fromBlock.timestamp * 1000);

        const expirationDate = new Date(
          fromBlockDate.getTime() + expirationInDays * 24 * 60 * 60 * 1000
        );

        const now = new Date();

        if (expirationDate < now) {
          this.#logger.info({
            msg: "pruning contract",
            contractName: subscription.contractName,
            address: subscription.contractAddress,
          });
          this.#indexer.unsubscribeFromContract({
            address: subscription.contractAddress,
          });
        }
      }
    } catch (err) {
      this.#logger.error({
        msg: "pruner error",
        err,
      });
    } finally {
      this.#scheduleNextPrune();
    }
  }
}
