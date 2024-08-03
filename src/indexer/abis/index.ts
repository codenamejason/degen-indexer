// Note: import your abi:
// import { abi as myAbi } from "./myAbi";
import { abi as degenPePeAbi } from "./tokens/DegenPepe.js";

// PharoV2
import PharoToken from "../abis/pharo/PharoToken.js";
import PharoCover from "./pharo/PharoCover.js";
import PharoMarket from "./pharo/PharoMarket.js";
import PharoPhinance from "./pharo/PharoPhinance.js";
import PharoReservePool from "./pharo/PharoReservePool.js";
import PharoRewards from "./pharo/PharoRewards.js";
import PharoRiskPool from "./pharo/PharoRiskPool.js";
import { abi as Allo } from "./allo/allo.js";
import { abi as Registry } from "./allo/registry.js";

// Add your abi's here like this: "myAbi": myAbi,
const abis = {
  DegenPepe: degenPePeAbi,
  "PharoV2/PharoToken": PharoToken,
  "PharoV2/PharoReservePool": PharoReservePool,
  "PharoV2/PharoRiskPool": PharoRiskPool,
  "PharoV2/PharoPhinance": PharoPhinance,
  "PharoV2/PharoCover": PharoCover,
  "PharoV2/PharoMarket": PharoMarket,
  "PharoV2/PharoRewards": PharoRewards,
  "AlloV2/Registry/V1": Registry,
  "AlloV2/Allo/V1": Allo,
} as const;

export default abis;
export type ContractName = keyof typeof abis;
// export type ContractAbi = typeof abis[ContractName];
