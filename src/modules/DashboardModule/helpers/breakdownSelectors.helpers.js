import * as R from 'ramda';

import { viewLoading, viewLoaded } from '../../../helpers/lens.helpers';

export const initialBreakdownState = {
  breakdown: [],
  isLoading: true,
  isLoaded: false,
  isReportLoading: false,
  error: null,
  pagination: {
    current_page: 1,
  },
};

export const createSelectors = rootSelector => stateName => {
  const getItemsState = R.compose(R.prop(stateName), rootSelector);

  const getItemsBreakdown = R.compose(R.prop('breakdown'), getItemsState);

  const getItemsPagination = R.compose(R.prop('pagination'), getItemsState);

  const getItemsIsLoading = R.compose(viewLoading, getItemsState);

  const getItemsReportIsLoading = R.compose(R.prop('isReportLoading'), getItemsState);

  const getItemsIsLoaded = R.compose(viewLoaded, getItemsState);

  return [
    getItemsState,
    getItemsBreakdown,
    getItemsIsLoading,
    getItemsReportIsLoading,
    getItemsIsLoaded,
    getItemsPagination,
  ];
};
