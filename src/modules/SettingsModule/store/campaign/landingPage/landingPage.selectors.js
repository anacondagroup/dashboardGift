import * as R from 'ramda';

import { getCampaignSettingsState } from '../campaign.selectors';

export const getCampaignLandingPageSettingsState = R.compose(R.prop('landingPage'), getCampaignSettingsState);

export const getCampaignLandingPageSettings = R.compose(R.prop('settings'), getCampaignLandingPageSettingsState);

export const getCampaignLandingPageIsLoading = R.compose(R.prop('isLoading'), getCampaignLandingPageSettingsState);

export const getCampaignLandingPageErrors = R.compose(R.prop('errors'), getCampaignLandingPageSettingsState);
