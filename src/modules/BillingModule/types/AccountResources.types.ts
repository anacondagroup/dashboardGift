export interface IInventory {
  accountId: string;
  resource: {
    count: number;
    resourceId: string;
  };
  resourceName: string;
  resourceImageUrl: string;
}

export interface IDeposit {
  accountId: string;
  money: {
    amount: number;
  };
}

export interface IAccountResources {
  inventory: IInventory[];
  deposit: [IDeposit];
}
