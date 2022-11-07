import {
  SWAG_BATCHES_BREAKDOWN_CLEAR,
  SWAG_BATCHES_BREAKDOWN_DATA_FAIL,
  SWAG_BATCHES_BREAKDOWN_DATA_REQUEST,
  SWAG_BATCHES_BREAKDOWN_DATA_SUCCESS,
  SWAG_BATCHES_DOWNLOAD_REPORT_LINK,
} from './swagBatches.types';

export const swagBatchesBreakdownDataRequest = payload => ({
  type: SWAG_BATCHES_BREAKDOWN_DATA_REQUEST,
  payload,
});

export const swagBatchesBreakdownDataSuccess = payload => ({
  type: SWAG_BATCHES_BREAKDOWN_DATA_SUCCESS,
  payload,
});

export const swagBatchesBreakdownDataFail = payload => ({
  type: SWAG_BATCHES_BREAKDOWN_DATA_FAIL,
  payload,
});

export const swagBatchesBreakdownClear = () => ({
  type: SWAG_BATCHES_BREAKDOWN_CLEAR,
});

export const swagBatchesDownloadReportLink = payload => ({
  type: SWAG_BATCHES_DOWNLOAD_REPORT_LINK,
  payload,
});
