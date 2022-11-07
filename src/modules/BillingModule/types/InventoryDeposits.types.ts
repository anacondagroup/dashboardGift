import { IDeposit, IInventory } from './AccountResources.types';

export interface IInventoryDeposits {
  inventory: IInventory;
  deposits: IDeposit[];
  totalMoney: number;
}
