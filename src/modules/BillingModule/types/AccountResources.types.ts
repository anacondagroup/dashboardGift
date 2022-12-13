import { TDeposit } from '@alycecom/services';

export interface IInventory {
  accountId: string;
  resource: {
    count: number;
    resourceId: string;
  };
  resourceName: string;
  resourceImageUrl: string;
}

export interface IAccountResources {
  inventory: IInventory[];
  deposit: [TDeposit];
}
