import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { getIsStandardCampaign } from '../../../helpers/campaignSettings.helpers';
import { IRootState } from '../../../../../store/root.types';

import { IGeneralCampaignSettingsState } from './general.reducer';

const getGeneralSettingsState = (state: IRootState): IGeneralCampaignSettingsState => state.settings.campaign.general;

export const getCampaignGeneralSettings = pipe(getGeneralSettingsState, state => state.campaign);

export const getCampaignGeneralSettingsIsLoading = pipe(
  getGeneralSettingsState,
  state => state.status === StateStatus.Pending,
);

export const getCampaignGeneralSettingsError = pipe(getGeneralSettingsState, state => state.errors);

export const getCampaignType = pipe(getCampaignGeneralSettings, campaign => campaign.type || '');

export const getIsStandard = pipe(getCampaignType, getIsStandardCampaign);
