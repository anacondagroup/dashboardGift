import { EntityId } from '@alycecom/utils';

import { IGiftVendor, IOldGiftVendor, VendorTypes } from './giftVendors.types';

export const getVendorKey = (vendor: { id: EntityId; type: VendorTypes }): string => `${vendor.id}/${vendor.type}`;

export const transformOldGiftVendorToGiftVendor = (oldGiftVendor: IOldGiftVendor): IGiftVendor => ({
  id: oldGiftVendor.id,
  name: oldGiftVendor.name,
  type: oldGiftVendor.type,
  description: oldGiftVendor.description,
  isCampaignRestricted: oldGiftVendor.is_campaign_restricted,
  isTeamRestricted: oldGiftVendor.is_team_restricted,
  logoUrl: oldGiftVendor.logo_url,
});
