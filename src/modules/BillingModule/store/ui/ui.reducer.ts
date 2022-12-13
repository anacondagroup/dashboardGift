import { combineReducers } from 'redux';

import { tab, TTabState } from './tab/tab.reducer';
import { overviewFilters, TOverviewFiltersState } from './overviewFilters/overviewFilters.reducer';
import { transactionsFilters, TTransactionsFiltersState } from './transactionsFilters/transactionsFilters.reducer';

export type TBillingUIState = {
  tab: TTabState;
  overviewFilters: TOverviewFiltersState;
  transactionsFilters: TTransactionsFiltersState;
};

export const ui = combineReducers<TBillingUIState>({
  tab,
  overviewFilters,
  transactionsFilters,
});
