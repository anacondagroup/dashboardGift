import { prop, pipe } from 'ramda';
import { createSelector } from 'reselect';

import { getDkimState } from '../dkim.selectors';

export const getDetailsState = createSelector(getDkimState, prop('details'));

export const getErrors = createSelector(getDetailsState, prop('errors'));

export const getIsLoading = pipe(getDetailsState, prop('isLoading'));

export const getDomain = createSelector(getDetailsState, prop('domain'));

export const getDomainRecords = createSelector(getDetailsState, prop('domainRecords'));

export const getIsVerifying = pipe(getDetailsState, prop('isVerifying'));

export const getIsVerified = pipe(getDetailsState, prop('isVerified'));

export const getIsSendingEmail = pipe(getDetailsState, prop('isSendingEmail'));

export const getIsSendEmailModalOpened = pipe(getDetailsState, prop('isSendEmailModalOpened'));
