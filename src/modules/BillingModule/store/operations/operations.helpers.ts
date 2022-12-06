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
  state: IRootState;
  dateRangeFieldNames?: TDateRangeNames;
  isFullList?: boolean;
};

export const getQueryParamsFromState = ({
  state,
  dateRangeFieldNames = { fromName: 'dateRange', toName: 'dateRange' },
  isFullList = false,
}: TGetQueryParamsFromStateArgs): TGetQueryParamsFromStateValue => {
  const params: Record<string, string | boolean | number | qs.Stringifiable[]> = {};
  const { fromName, toName } = dateRangeFieldNames;

  const { id: orgId } = getOrg(state);
  const {
    deposit: { accountId },
    balanceAccountId,
  } = getSelectedGroupOrTeam(state);
  const dateRange = getDateRange(state);
  const operationTypes = getSelectedTypes(state);
  const { perPage, currentPage, total } = getPagination(state);
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
