import * as R from 'ramda';
import { createSelector } from 'reselect';

const pathToSwagBatchesSettings = R.path(['settings', 'campaign', 'swagBatches']);

export const getSwagBatchesSettings = createSelector(pathToSwagBatchesSettings, settings => settings);
