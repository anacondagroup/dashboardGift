import { createSelector } from 'reselect';
import * as R from 'ramda';

const pathToSwagBatches = R.path(['dashboard', 'breakdowns', 'swagBatches']);

export const getSwagBatchesBreakdownState = createSelector(pathToSwagBatches, state => state);

export const getSwagBatchesReportLink = createSelector(pathToSwagBatches, state => state.reportLink);
