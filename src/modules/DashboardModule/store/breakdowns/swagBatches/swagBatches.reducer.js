import {
  SWAG_BATCHES_BREAKDOWN_CLEAR,
  SWAG_BATCHES_BREAKDOWN_DATA_FAIL,
  SWAG_BATCHES_BREAKDOWN_DATA_REQUEST,
  SWAG_BATCHES_BREAKDOWN_DATA_SUCCESS,
} from './swagBatches.types';

const initialState = {
  isLoading: false,
  batches: undefined,
  reportLink: '',
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SWAG_BATCHES_BREAKDOWN_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SWAG_BATCHES_BREAKDOWN_DATA_SUCCESS:
      return {
        ...state,
        batches: payload.batches,
        reportLink: payload.report_link,
        isLoading: false,
      };
    case SWAG_BATCHES_BREAKDOWN_DATA_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case SWAG_BATCHES_BREAKDOWN_CLEAR:
      return {
        ...state,
        reportLink: '',
        batches: undefined,
      };
    default:
      return {
        ...state,
      };
  }
};
