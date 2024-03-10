import {
  TNewLiquidityProduct,
  TNewObelisk,
  TNewPolicy,
  TNewPrice,
  TNewSignedPolicy,
  TNewSignedPosition,
  TNewWoS,
  TPartialLiquidityProduct,
  TPartialObelisk,
  TPartialPolicy,
  TPartialPrice,
  TPartialSignedPolicy,
  TPartialSignedPosition,
  TPartialWoS,
} from "./schema.js";

export type DataChange =
  | {
      type: "InsertPolicy";
      policy: TNewPolicy;
    }
  | {
      type: "UpdatePolicy";
      policyId: number;
      policy: TPartialPolicy;
    }
  | {
      type: "InsertObelisk";
      obelisk: TNewObelisk;
    }
  | {
      type: "UpdateObelisk";
      obelisk: TPartialObelisk;
    }
  | {
      type: "InsertWoS";
      woc: TNewWoS;
    }
  | {
      type: "UpdateWoS";
      wocId: number;
      woc: TPartialWoS;
    }
  | {
      type: "InsertPrice";
      price: TNewPrice;
    }
  | {
      type: "UpdatePrice";
      price: TPartialPrice;
    }
  | {
      type: "DeletePolicy";
      policyId: number;
    }
  | {
      type: "DeleteObelisk";
      obeliskId: number;
    }
  | {
      type: "DeleteWoS";
      wocId: number;
    }
  | {
      type: "DeletePrice";
      priceId: number;
    }
  | {
      type: "InsertSignedPosition";
      signedPosition: TNewSignedPosition;
    }
  | {
      type: "UpdateSignedPosition";
      signedPositionId: number;
      signedPosition: TPartialSignedPosition;
    }
  | {
      type: "DeleteSignedPosition";
      signedPositionId: number;
    }
  | {
      type: "InsertSignedPolicy";
      signedPolicy: TNewSignedPolicy;
    }
  | {
      type: "UpdateSignedPolicy";
      signedPolicyId: number;
      signedPolicy: TPartialSignedPolicy;
    }
  | {
      type: "DeleteSignedPolicy";
      signedPolicyId: number;
    }
  | {
      type: "InsertLiquidityProduct";
      liquidityProduct: TNewLiquidityProduct;
    }
  | {
      type: "UpdateLiquidityProduct";
      liquidityProductId: number;
      liquidityProduct: TPartialLiquidityProduct;
    }
  | {
      type: "DeleteLiquidityProduct";
      liquidityProductId: number;
    }
  | { [key: string]: any };
