import { EntityId } from '@alycecom/utils';

import { ProductVendorsTypes } from '../entities/productVendors/productVendors.types';

export type TeamVendorRestriction = {
  id: number;
  type: ProductVendorsTypes;
};

export type TTeamSettingsData = {
  restrictedProductsTypes: EntityId[];
  restrictedProductsVendors: TeamVendorRestriction[];
};
