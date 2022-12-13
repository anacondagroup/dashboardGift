import { TDeposit } from '@alycecom/services';

import { IInventory } from './AccountResources.types';

export interface IInventoryDeposits {
  inventory: IInventory;
  deposits: TDeposit[];
  totalMoney: number;
}
