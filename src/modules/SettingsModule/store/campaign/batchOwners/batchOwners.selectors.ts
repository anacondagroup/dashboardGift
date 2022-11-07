import { createSelector } from 'reselect';

import { IRootState } from '../../../../../store/root.types';

const pathToCampaignSettings = (state: IRootState) => state.settings.campaign;

export const getGeneralSettingsBatchOwners = createSelector(pathToCampaignSettings, campaign => campaign.batchOwners);
