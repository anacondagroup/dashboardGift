import { createSelector } from 'reselect';
import { applySpec, prop, path, always, compose, when, identity, complement, isNil, pipe, propOr } from 'ramda';

import {
  getIsStandardCampaign,
  getIsActivateCampaign,
  getIsSwagCampaign,
} from '../../../helpers/campaignSettings.helpers';
import { CAMPAIGN_STATUS } from '../../../../../constants/campaignSettings.constants';

const pathToCommonCampaignData = path(['settings', 'campaign', 'commonData']);

export const getCommonCampaignData = createSelector(pathToCommonCampaignData, prop('campaign'));

export const getCampaignType = pipe(getCommonCampaignData, propOr('', 'type'));

export const getCampaignTeamId = pipe(getCommonCampaignData, prop('team_id'));

export const getCampaignCustomMarketplaceId = pipe(getCommonCampaignData, prop('customMarketplaceId'));

export const getCampaignStatus = pipe(getCommonCampaignData, propOr('', 'status'));

export const getIsArchived = pipe(getCampaignStatus, status => status === CAMPAIGN_STATUS.ARCHIVED);

export const getIsStandart = pipe(getCampaignType, getIsStandardCampaign);

export const getIsActivate = pipe(getCampaignType, getIsActivateCampaign);

export const getIsSwag = pipe(getCampaignType, getIsSwagCampaign);

export const getIsInternational = pipe(getCommonCampaignData, propOr(false, 'isInternational'));

export const getIsAllowEditTemplate = pipe(getCommonCampaignData, propOr(true, 'allowEditTemplate'));

// TODO: Update template response, for returning default template.
export const getDefaultTemplate = createSelector(
  getCommonCampaignData,
  applySpec({
    id: always(999),
    name: compose(when(complement(identity), always('Blank template')), prop('subject')),
    subject: propOr('', 'subject'),
    message: propOr('', 'message'),
    isDefault: pipe(prop('subject'), complement(isNil)),
  }),
);
