import { propOr } from 'ramda';
import { upperFirstLetter } from '@alycecom/utils';

import { CAMPAIGN_TYPE_NAMES, CAMPAIGN_TYPES } from '../constants/campaignSettings.constants';

export const getCampaignTypeName = (type: CAMPAIGN_TYPES, hasA4MFeatureFlag: boolean = false): string => {
  const isSwag = type.includes(CAMPAIGN_TYPES.SWAG);

  if (isSwag) {
    const campaignName = CAMPAIGN_TYPE_NAMES[CAMPAIGN_TYPES.SWAG];
    const swagParts = type.split(' ');
    const swagType = swagParts.length > 1 ? upperFirstLetter(swagParts[1]) : '';
    return `${swagType} ${campaignName}`;
  }

  const getName = (): string => propOr(CAMPAIGN_TYPE_NAMES[CAMPAIGN_TYPES.STANDARD], type, CAMPAIGN_TYPE_NAMES);

  if (hasA4MFeatureFlag) {
    return type === CAMPAIGN_TYPES.ACTIVATE ? CAMPAIGN_TYPE_NAMES[CAMPAIGN_TYPES.A4M] : getName();
  }

  return getName();
};
