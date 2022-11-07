import { MarketplacesListOptionType } from '../../types';

export interface IOption {
  id?: number;
  label: string;
  type: MarketplacesListOptionType;
  productsCount?: number;
}
