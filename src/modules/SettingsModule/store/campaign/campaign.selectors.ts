import * as R from 'ramda';

import { getSettingsState } from '../settings.selectors';

export const getCampaignSettingsState = R.compose(R.prop('campaign'), getSettingsState);
