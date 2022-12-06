import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { TTabState, name } from './tab.reducer';

const getOverviewFiltersState = (state: IRootState): TTabState => state.billing.ui[name];

export const getCurrentTab = pipe(getOverviewFiltersState, state => state.currentTab);
