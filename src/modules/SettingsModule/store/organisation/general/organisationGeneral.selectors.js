import * as R from 'ramda';

import { getOrganisationState } from '../organisation.selectors';

export const getOrganisationGeneralState = R.compose(R.prop('general'), getOrganisationState);

export const getSettings = R.compose(R.prop('settings'), getOrganisationGeneralState);

export const getIsLoading = R.compose(R.prop('isLoading'), getOrganisationGeneralState);

export const getErrors = R.compose(R.prop('errors'), getOrganisationGeneralState);
