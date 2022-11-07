import { CAMPAIGN_TYPES } from '../../../constants/campaignSettings.constants';

export const getIsStandardCampaign = (type: string): boolean => type === CAMPAIGN_TYPES.STANDARD;

export const getIsActivateCampaign = (type: string): boolean => type === CAMPAIGN_TYPES.ACTIVATE;

export const getIsSwagCampaign = (type: string): boolean => type.includes(CAMPAIGN_TYPES.SWAG);

export const getIsProspectingCampaign = (type: string): boolean => type === CAMPAIGN_TYPES.PROSPECTING;
