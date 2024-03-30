import {
  TNewPrice,
  TNewRole,
  TNewTransfer,
  TNewUser,
  TNewUserRewards,
  TPartialPrice,
  TPartialRole,
  TPartialUserRewards,
} from "./schema.js";

export type DataChange =
  | {
      type: "InsertPrice";
      price: TNewPrice;
    }
  | {
      type: "UpdatePrice";
      price: TPartialPrice;
    }
  | {
      type: "DeletePrice";
      priceId: number;
    }
  | {
      type: "InsertUserRewards";
      userRewards: TNewUserRewards;
    }
  | {
      type: "DeleteUserRewards";
      userRewardsId: number;
    }
  | {
      type: "UserRewards";
      user: TPartialUserRewards;
    }
  | {
      type: "InsertTransfer";
      transfer: TNewTransfer;
    }
  | {
      type: "DeleteTransfer";
      transferId: number;
    }
  | {
      type: "InsertUser";
      user: TNewUser;
    }
  | {
      type: "InsertRole";
      role: TNewRole;
    }
  | {
      type: "DeleteRole";
      roleId: number;
    }
  | {
      type: "UpdateRole";
      roleId: number;
      role: TPartialRole;
    }
  | { [key: string]: any };
