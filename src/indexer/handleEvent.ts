import { randomUUID } from "crypto";
import { parseAddress } from "../address.js";
import { Changeset } from "../database/index.js";
import { TPharoState } from "../types.js";

export async function handleEvent(
  args
): Promise<Changeset[]> {
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

    case "PharoCreated":
      const pharoParams = args.event.params as {
        pharoId: string;
        name: string;
        description: string;
        lifetime: string;
        created_at: bigint;
        state: TPharoState;
        trueEventTime: bigint;
      };
      return [
        {
          type: "InsertPharo",
          pharo: {
            id: randomUUID().toString(),
            pharoId: BigInt(pharoParams.pharoId),
            name: pharoParams.name,
            description: pharoParams.description,
            lifetime: BigInt(pharoParams.lifetime),
            state: "MUMMY",
            trueEventTime: BigInt(pharoParams.trueEventTime),
            blockNumber: BigInt(event.blockNumber),
            birthdate: BigInt(new Date().getTime()),
          },
        },
      ];

    case "Locked":
      const lockTokenParams = args.event.params as {
        of: string;
        reason: string;
        amount: bigint;
        validity: bigint;
        claimed: boolean;
      };
      return [
        {
          type: "InsertLockToken",
          lockToken: {
            id: randomUUID().toString(),
            blockNumber: BigInt(event.blockNumber),
            user: parseAddress(lockTokenParams.of),
            amount: BigInt(lockTokenParams.amount),
            validity: BigInt(lockTokenParams.validity),
            claimed: lockTokenParams.claimed,
          },
        },
      ];

    // case "Unlocked":
    //   const unlockTokenParams = args.event.params as {
    //     of: string;
    //     reason: string;
    //     amount: bigint;
    //   };
    //   return [
    //     {
    //       type: "DeleteLockToken",
    //       lockTokenId: 0,
    //     },
    //   ];

    default:
      break;
  }

  return [];
}
