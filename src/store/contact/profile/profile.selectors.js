import * as R from 'ramda';

import { getContactState } from '../contact.selectors';
import { viewLoading } from '../../../helpers/lens.helpers';

export const getProfileState = R.compose(R.prop('profile'), getContactState);

export const getProfile = getProfileState;

export const getStatistic = R.compose(R.pick(['statistic']), getProfileState);

export const getLatestGift = R.compose(R.pick(['latest_gift']), getProfileState);

export const getProfileIsLoading = R.compose(viewLoading, getProfileState);
