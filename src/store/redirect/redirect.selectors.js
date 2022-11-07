import * as R from 'ramda';

export const getRedirectState = R.prop('redirect');

export const getGift = R.compose(R.prop('gift'), getRedirectState);

export const getError = R.compose(R.prop('error'), getRedirectState);
