import { createReducer } from 'redux-act';

import { IDomain } from '../domains/domains.types';

import {
  loadDomainDetailsRequest,
  loadDomainDetailsSuccess,
  loadDomainDetailsFail,
  setDomain,
  resetDomainDetails,
  verifyRequest,
  verifySuccess,
  verifyFail,
  sendEmailRequest,
  sendEmailSuccess,
  sendEmailFail,
  resetErrors,
  setSendEmailModalOpen,
} from './details.actions';
import { getDomainStatusFromDetails } from './details.helpers';
import { IDomainRecord } from './details.types';

export interface IDetailsState {
  isLoading: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  isSendingEmail: boolean;
  isSendEmailModalOpened: boolean;
  domain: IDomain | null;
  domainRecords: IDomainRecord[];
  errors: Record<string, unknown>;
}

export const initialState: IDetailsState = {
  isLoading: false,
  isVerifying: false,
  isVerified: false,
  isSendingEmail: false,
  isSendEmailModalOpened: false,
  domain: null,
  domainRecords: [],
  errors: {},
};

const reducer = createReducer({}, initialState);

reducer.on(loadDomainDetailsRequest, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(loadDomainDetailsSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  domainRecords: payload,
}));
reducer.on(loadDomainDetailsFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

reducer.on(setDomain, (state, payload) => ({
  ...state,
  domain: payload,
}));
reducer.on(resetDomainDetails, state => ({
  ...state,
  ...initialState,
}));

reducer.on(verifyRequest, state => ({
  ...state,
  isVerifying: true,
}));
reducer.on(verifySuccess, (state, payload) => ({
  ...state,
  isVerifying: false,
  isVerified: true,
  domainRecords: payload,
  domain: state.domain
    ? {
        ...state.domain,
        status: getDomainStatusFromDetails(payload),
      }
    : null,
}));
reducer.on(verifyFail, (state, payload) => ({
  ...state,
  isVerifying: false,
  errors: payload,
}));

reducer.on(sendEmailRequest, state => ({
  ...state,
  isSendingEmail: true,
}));
reducer.on(sendEmailSuccess, state => ({
  ...state,
  isSendingEmail: false,
  isEmailSent: true,
}));
reducer.on(sendEmailFail, (state, payload) => ({
  ...state,
  isSendingEmail: false,
  errors: payload,
}));

reducer.on(setSendEmailModalOpen, (state, payload) => ({
  ...state,
  isEmailSent: false,
  isSendEmailModalOpened: payload,
}));
reducer.on(resetErrors, state => ({
  ...state,
  errors: {},
}));

export default reducer;
