import PharoToken from "../abis/pharo/PharoToken.js";

const abis = {
  "PharoV2/PharoToken": PharoToken,
};

export default abis;
export type ContractName = keyof typeof abis;
export type ContractAbi = typeof abis[ContractName];
