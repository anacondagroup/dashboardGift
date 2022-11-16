import { StateObservable } from 'redux-observable';
import qs from 'query-string';

import { IRootState } from '../../../../store/root.types';
import { getOrg, getSelectedGroupOrTeam } from '../customerOrg';

import { getDateRange, getPagination, getSelectedTypes } from './operations.selectors';

type TGetQueryParamsFromStateValue = {
  orgId: number;
  accountId: string;
  balanceAccountId?: string;
  params: Record<string, string | boolean | number | qs.Stringifiable[]>;
};

type TDateRangeNames = {
  fromName: string;
  toName: string;
};

type TGetQueryParamsFromStateArgs = {
  state$: StateObservable<IRootState>;
  dateRangeFieldNames?: TDateRangeNames;
  isFullList?: boolean;
};

export const getQueryParamsFromState = ({
  state$,
  dateRangeFieldNames = { fromName: 'dateRange', toName: 'dateRange' },
  isFullList = false,
}: TGetQueryParamsFromStateArgs): TGetQueryParamsFromStateValue => {
  const params: Record<string, string | boolean | number | qs.Stringifiable[]> = {};
  const { fromName, toName } = dateRangeFieldNames;

  const { id: orgId } = getOrg(state$.value);
  const {
    deposit: { accountId },
    balanceAccountId,
  } = getSelectedGroupOrTeam(state$.value);
  const dateRange = getDateRange(state$.value);
  const operationTypes = getSelectedTypes(state$.value);
  const { perPage, currentPage, total } = getPagination(state$.value);
  if (dateRange.from) {
    params[`${fromName}[from]`] = dateRange.from;
    params[`${toName}[fromIncluded]`] = true;
  }
  if (dateRange.to) {
    params[`${fromName}[to]`] = dateRange.to;
    params[`${toName}[toIncluded]`] = true;
  }
  params['operationTypes[]'] = operationTypes;
  params.perPage = isFullList ? total : perPage;
  params.page = isFullList ? 1 : currentPage;

  return {
    orgId,
    accountId,
    balanceAccountId,
    params,
  };
};
