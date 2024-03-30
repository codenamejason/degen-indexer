// Note: import your abi:
// import { abi as myAbi } from "./myAbi";
import { abi as degenPePeAbi } from "./tokens/DegenPepe.js";
// Add your abi's here like this: "myAbi": myAbi,
const abis = {
  DegenPepe: degenPePeAbi,
} as const;

export default abis;
export type ContractName = keyof typeof abis;
// export type ContractAbi = typeof abis[ContractName];
