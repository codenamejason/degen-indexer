// import { createIndexer, createHttpRpcClient } from "chainsauce";

// const indexer = createIndexer({
//     chain: {
//       id: 1,
//       rpcClient: createHttpRpcClient({
//         url: "https://mainnet.infura.io/v3/...",
//       }),
//     },
//     contracts: MyContracts,
//   });

async function main(): Promise<void> {
  console.log("Hello, world!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
