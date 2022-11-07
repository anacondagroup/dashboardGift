import { createAction } from 'redux-act';

import { IDomainRecord } from './details.types';

const PREFIX = 'ORGANIZATION/SETTINGS/DKIM/DETAILS';

export const loadDomainDetailsRequest = createAction(`${PREFIX}/LOAD_DOMAIN_DETAILS_REQUEST`);
export const loadDomainDetailsSuccess = createAction<IDomainRecord[]>(`${PREFIX}/LOAD_DOMAIN_DETAILS_SUCCESS`);
export const loadDomainDetailsFail = createAction<Record<string, unknown>>(`${PREFIX}/LOAD_DOMAIN_DETAILS_FAIL`);

export const setDomain = createAction(`${PREFIX}/SET_DOMAIN`);

export const resetDomainDetails = createAction(`${PREFIX}/RESET_DOMAIN_DETAILS`);

export const verifyRequest = createAction<{ id: number }>(`${PREFIX}/VERIFY_REQUEST`);
export const verifySuccess = createAction<IDomainRecord[]>(`${PREFIX}/VERIFY_SUCCESS`);
export const verifyFail = createAction<Record<string, unknown>>(`${PREFIX}/VERIFY_FAIL`);

export const sendEmailRequest = createAction<{ id: number; email: string }>(`${PREFIX}/SEND_EMAIL_REQUEST`);
export const sendEmailSuccess = createAction(`${PREFIX}/SEND_EMAIL_SUCCESS`);
export const sendEmailFail = createAction<Record<string, unknown>>(`${PREFIX}/SEND_EMAIL_FAIL`);

export const resetErrors = createAction(`${PREFIX}/RESET_ERRORS`);

export const setSendEmailModalOpen = createAction<boolean>(`${PREFIX}/SET_SEND_EMAIL_MODAL_OPEN`);
