import { prop, pipe } from 'ramda';

import { getDkimState } from '../dkim.selectors';

export const getDomainsState = pipe(getDkimState, prop('domains'));

export const getDomains = pipe(getDomainsState, prop('domains'));

export const getErrors = pipe(getDomainsState, prop('errors'));

export const getIsLoaded = pipe(getDomainsState, prop('isLoaded'));

export const getIsLoading = pipe(getDomainsState, prop('isLoading'));

export const getDomainName = pipe(getDomainsState, prop('domainName'));
