import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { contactsAdapter } from './contacts.reducer';

const getContactsState = (state: IRootState) => state.activate.steps.recipients.contacts;
const getContactsStateStatus = pipe(getContactsState, state => state.status);
const selectors = contactsAdapter.getSelectors(getContactsState);

export const getIsContactsLoading = pipe(getContactsStateStatus, status => status === StateStatus.Pending);
export const getIsContactsLoaded = pipe(getContactsStateStatus, status => status === StateStatus.Fulfilled);

export const getContactsIds = selectors.getIds;
export const getContactsMap = selectors.getEntities;
export const getContacts = selectors.getAll;
export const getContactById = selectors.getById;

export const getTotalContacts = pipe(getContactsState, state => state.meta?.total);
export const getMetaData = pipe(getContactsState, state => state.meta);
export const getActivateCampaignSourceType = pipe(getContactsState, state => state.sourceType);
export const getMarketoComputedUrl = pipe(getContactsState, state => state.marketoComputedUrl);

export const getContactsFilters = pipe(getContactsState, state => state.filters);
export const getContactsSortField = pipe(getContactsFilters, state => state.sortField);
export const getContactsSortDirection = pipe(getContactsFilters, state => state.sortDirection);

export const getContactsPagination = pipe(getContactsState, state => state.pagination);
