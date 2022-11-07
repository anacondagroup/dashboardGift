import {
  OVERVIEW_LOAD_SUCCESS,
  OVERVIEW_LOAD_REQUEST,
  OVERVIEW_LOAD_FAIL,
  OVERVIEW_DOWNLOAD_REPORT_REQUEST,
  OVERVIEW_DOWNLOAD_REPORT_SUCCESS,
  OVERVIEW_DOWNLOAD_REPORT_FAIL,
} from './overview.types';

export const initialState = {
  errors: {},
  kpi: {},
  statuses: {},
  downloadReportLink: '',
  isLoading: false,
  isReportLoading: false,
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case OVERVIEW_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case OVERVIEW_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        statuses: action.payload.gift_statuses || {},
        kpi: action.payload.kpi,
        downloadReportLink: action.payload.report_link,
      };
    case OVERVIEW_LOAD_FAIL:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
      };
    case OVERVIEW_DOWNLOAD_REPORT_REQUEST:
      return {
        ...state,
        isReportLoading: true,
      };
    case OVERVIEW_DOWNLOAD_REPORT_SUCCESS:
    case OVERVIEW_DOWNLOAD_REPORT_FAIL:
      return {
        ...state,
        isReportLoading: false,
      };
    default:
      return state;
  }
};
