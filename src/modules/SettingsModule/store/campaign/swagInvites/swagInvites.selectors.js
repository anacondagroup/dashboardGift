import * as R from 'ramda';

import { getCampaignSettingsState } from '../campaign.selectors';

export const getCampaignSwagInvitesSettingsState = R.compose(R.prop('swagInvites'), getCampaignSettingsState);

export const getCampaignSwagInvitesSettings = R.compose(R.prop('settings'), getCampaignSwagInvitesSettingsState);

export const getCampaignSettingsIsLoading = R.compose(R.prop('isLoading'), getCampaignSwagInvitesSettingsState);

export const getSwagCampaignProductTypesIsLoading = R.compose(
  R.prop('productTypesLoading'),
  getCampaignSwagInvitesSettingsState,
);

export const getSwagCampaignProductTypes = R.compose(R.prop('productTypes'), getCampaignSwagInvitesSettingsState);

export const getSwagCampaignDefaultProductId = R.compose(
  R.prop('defaultProductId'),
  getCampaignSwagInvitesSettingsState,
);

export const getCampaignSettingsIsLoaded = R.compose(R.prop('isLoaded'), getCampaignSwagInvitesSettingsState);

export const getCampaignSettingsErrors = R.compose(R.prop('errors'), getCampaignSwagInvitesSettingsState);
