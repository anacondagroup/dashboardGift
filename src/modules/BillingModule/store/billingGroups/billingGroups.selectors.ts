import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const getBillingGroupsState = (state: IRootState) => state.billing.billingGroups;

export const getBillingGroupsIsLoading = pipe(getBillingGroupsState, state => state.status === StateStatus.Pending);

export const getBillingGroups = pipe(getBillingGroupsState, state => state.billingInfoComplete.billingGroups);

export const getPagination = pipe(getBillingGroupsState, state => state.billingInfoComplete.pagination);

export const getSearchGroupTerm = pipe(getBillingGroupsState, state => state.searchGroupTerm);

export const getSearchGroupsResults = pipe(getBillingGroupsState, state => state.searchGroupResults);

export const getIsSearching = pipe(getBillingGroupsState, state => state.isSearching);
