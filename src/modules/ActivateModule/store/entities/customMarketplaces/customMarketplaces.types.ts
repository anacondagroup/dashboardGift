import { EntityId } from '@alycecom/utils';

export type TShortCustomMarketplace = {
  id: EntityId;
  name: string;
  productsCount: number;
  teamIds: EntityId[];
  countryIds: number[];
};
