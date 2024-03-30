// Note: import your abi:
// import { abi as myAbi } from "./myAbi";
// Add your abi's here like this: "myAbi": myAbi,
const abis = {} as const;

export default abis;
export type ContractName = keyof typeof abis;
// export type ContractAbi = typeof abis[ContractName];
