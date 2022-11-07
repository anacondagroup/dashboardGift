import * as R from 'ramda';

import { getSettingsState } from '../settings.selectors';

export const getOrganisationState = R.compose(R.prop('organisation'), getSettingsState);
