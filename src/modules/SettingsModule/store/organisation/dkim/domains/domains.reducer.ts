import { createReducer } from 'redux-act';
import { reject } from 'ramda';

import {
  loadDomainsRequest,
  loadDomainsSuccess,
  loadDomainsFail,
  addDomainRequest,
  addDomainSuccess,
  addDomainFail,
  removeDomainRequest,
  removeDomainSuccess,
  removeDomainFail,
  setDomainName,
  resetError,
} from './domains.actions';
import { IDomain } from './domains.types';

export interface IDomainsState {
  isLoading: boolean;
  isLoaded: boolean;
  domainName: string;
  domains: IDomain[];
  errors: Record<string, unknown>;
}

export const initialState: IDomainsState = {
  isLoading: false,
  isLoaded: false,
  domainName: '',
  domains: [],
  errors: {},
};

const reducer = createReducer({}, initialState);

reducer.on(loadDomainsRequest, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(loadDomainsSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  domains: payload,
}));
reducer.on(loadDomainsFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

reducer.on(addDomainRequest, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(addDomainSuccess, (state, payload) => ({
  ...state,
  domainName: '',
  domains: [...state.domains, payload],
  isLoading: false,
}));
reducer.on(addDomainFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

reducer.on(removeDomainRequest, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(removeDomainSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  domains: reject(item => item.id === payload, state.domains),
}));
reducer.on(removeDomainFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

reducer.on(setDomainName, (state, payload) => ({
  ...state,
  domainName: payload,
}));

reducer.on(resetError, state => ({
  ...state,
  errors: {},
}));

export default reducer;
