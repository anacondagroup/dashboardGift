import { EntityId } from '@alycecom/utils';

export type TShortCustomMarketplace = {
  id: number;
  name: string;
  productsCount: number;
  teamIds: EntityId[];
  countryIds: number[];
};
