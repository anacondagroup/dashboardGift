import { combineReducers } from 'redux';

import { tab, TTabState } from './tab/tab.reducer';
import { overviewFilters, TOverviewFiltersState } from './overviewFilters/overviewFilters.reducer';

export type TBillingUIState = {
  tab: TTabState;
  overviewFilters: TOverviewFiltersState;
};

export const ui = combineReducers<TBillingUIState>({
  tab,
  overviewFilters,
});
