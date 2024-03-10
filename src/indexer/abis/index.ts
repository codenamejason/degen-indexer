import PharoToken from "../abis/pharo/PharoToken.js";
import PharoCover from "./pharo/PharoCover.js";
import PharoMarket from "./pharo/PharoMarket.js";
import PharoPhinance from "./pharo/PharoPhinance.js";
import PharoReservePool from "./pharo/PharoReservePool.js";
import PharoRewards from "./pharo/PharoRewards.js";
import PharoRiskPool from "./pharo/PharoRiskPool.js";

const abis = {
  "PharoV2/PharoToken": PharoToken,
  "PharoV2/PharoReservePool": PharoReservePool,
  "PharoV2/PharoRiskPool": PharoRiskPool,
  "PharoV2/PharoPhinance": PharoPhinance,
  "PharoV2/PharoCover": PharoCover,
  "PharoV2/PharoMarket": PharoMarket,
  "PharoV2/PharoRewards": PharoRewards,
} as const;

export default abis;
export type ContractName = keyof typeof abis;
// export type ContractAbi = typeof abis[ContractName];
