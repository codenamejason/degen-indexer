import { randomUUID } from "crypto";
import { parseAddress } from "../address.js";
import { Changeset } from "../database/index.js";

export async function handleEvent(args: any): Promise<Changeset[]> {
  // todo: implement
  console.log("handleEvent", args.event.name, args.event.params);

  const {
    chainId,
    event,
    subscribeToContract,
    readContract,
    getBlock,
    // context: { rpcClient },
  } = args;

  switch (args.event.name) {
    case "Transfer":
      const transferParams = args.event.params as {
        from: string;
        to: string;
        value: string;
      };

      // const tx = await rpcClient.getTransaction(event.transactionHash);
      console.log("transferParams", transferParams);

      return [
        {
          type: "InsertTransfer",
          transfer: {
            id: randomUUID(),
            from: parseAddress(transferParams.from),
            to: parseAddress(transferParams.to),
            amount: BigInt(transferParams.value),
            transfered_at: BigInt(event.transactionHash),
            block_number: BigInt(event.blockNumber),
          },
        },
      ];

    default:
      break;
  }

  return [];
}
