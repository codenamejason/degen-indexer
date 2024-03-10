import { EventHandlerArgs, Indexer } from "chainsauce";
import { randomUUID } from "crypto";
import { parseAddress } from "../address.js";
import { Changeset } from "../database/index.js";

export async function handleEvent(
  args: EventHandlerArgs<Indexer>
): Promise<Changeset[]> {
  // todo: implement
  console.log("handleEvent", args.event.name, args.event.params);

  const { chainId, event, subscribeToContract, readContract, getBlock } = args;

  switch (args.event.name) {
    case "Transfer":
      const transferParams = args.event.params as {
        from: string;
        to: string;
        value: string;
      };

      return [
        {
          type: "InsertTransfer",
          transfer: {
            id: randomUUID(),
            from: parseAddress(transferParams.from),
            to: parseAddress(transferParams.to),
            amount: BigInt(transferParams.value),
            transfered_at: BigInt(new Date().getTime()),
            block_number: BigInt(event.blockNumber),
          },
        },
      ];

    case "RoleGranted":
      const roleParams = args.event.params as { account: string; role: string };
      return [
        {
          type: "InsertRole",
          role: {
            id: randomUUID().toString(),
            user: parseAddress(roleParams.account),
            role: roleParams.role,
            created_at: BigInt(new Date().getTime()),
            updated_at: BigInt(new Date().getTime()),
          },
        },
      ];

    default:
      break;
  }

  return [];
}
