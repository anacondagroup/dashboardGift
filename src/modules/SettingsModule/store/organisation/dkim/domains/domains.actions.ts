import { createAction } from 'redux-act';

import { IDomain } from './domains.types';

const PREFIX = 'ORGANIZATION/SETTINGS/DKIM/DOMAINS';

export const loadDomainsRequest = createAction(`${PREFIX}/LOAD_DOMAINS_REQUEST`);
export const loadDomainsSuccess = createAction<IDomain[]>(`${PREFIX}/LOAD_DOMAINS_SUCCESS`);
export const loadDomainsFail = createAction<Record<string, unknown>>(`${PREFIX}/LOAD_DOMAINS_FAIL`);

export const addDomainRequest = createAction<string>(`${PREFIX}/ADD_DOMAIN_REQUEST`);
export const addDomainSuccess = createAction<IDomain>(`${PREFIX}/ADD_DOMAIN_SUCCESS`);
export const addDomainFail = createAction<Record<string, unknown>>(`${PREFIX}/ADD_DOMAIN_FAIL`);

export const removeDomainRequest = createAction<{ id: number; domain: string }>(`${PREFIX}/REMOVE_DOMAIN_REQUEST`);
export const removeDomainSuccess = createAction<number>(`${PREFIX}/REMOVE_DOMAIN_SUCCESS`);
export const removeDomainFail = createAction<Record<string, unknown>>(`${PREFIX}/REMOVE_DOMAIN_FAIL`);

export const setDomainName = createAction<string>(`${PREFIX}/SET_DOMAIN_NAME`);

export const resetError = createAction(`${PREFIX}/RESET_ERROR`);
