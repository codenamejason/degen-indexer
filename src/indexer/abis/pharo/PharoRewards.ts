export default [
  {
    type: "function",
    name: "calcAbsDiff32",
    inputs: [
      { name: "val1", type: "uint32", internalType: "uint32" },
      { name: "val2", type: "uint32", internalType: "uint32" },
    ],
    outputs: [{ name: "delta", type: "uint32", internalType: "uint32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "calcScore",
    inputs: [
      { name: "rateEstimate", type: "uint32", internalType: "uint32" },
      { name: "rateTruth", type: "uint32", internalType: "uint32" },
      { name: "", type: "uint16", internalType: "uint16" },
      { name: "alpha", type: "uint16", internalType: "uint16" },
      { name: "beta", type: "uint16", internalType: "uint16" },
      { name: "gamma_x", type: "uint32[]", internalType: "uint32[]" },
      { name: "gamma_y", type: "uint32[]", internalType: "uint32[]" },
    ],
    outputs: [{ name: "score", type: "uint32", internalType: "uint32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "calculateReward",
    inputs: [
      { name: "rateEstimate", type: "uint32", internalType: "uint32" },
      { name: "premium", type: "uint256", internalType: "uint256" },
      { name: "rateTruth", type: "uint32", internalType: "uint32" },
      { name: "gof", type: "uint32", internalType: "uint32" },
      { name: "alpha", type: "uint32", internalType: "uint32" },
      { name: "beta", type: "uint32", internalType: "uint32" },
      { name: "gamma_x", type: "uint32[]", internalType: "uint32[]" },
      { name: "gamma_y", type: "uint32[]", internalType: "uint32[]" },
    ],
    outputs: [{ name: "reward", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "UserReward",
    inputs: [
      {
        name: "reward",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];
