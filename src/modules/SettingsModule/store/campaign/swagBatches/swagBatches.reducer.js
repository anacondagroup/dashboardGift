import { SWAG_SELECT_GENERATION_CODES_PROGRESS_FAIL } from '../swagSelect/swagSelect.types';

import {
  SWAG_CODES_SETTINGS_ALL_SETTINGS_REQUEST,
  SWAG_CODES_SETTINGS_ALL_SETTINGS_SUCCESS,
  SWAG_CODES_SETTINGS_BATCHES_UPDATING_END,
  SWAG_CODES_SETTINGS_BATCHES_UPDATING_START,
} from './swagBatches.types';

const initState = {
  codeInventory: [],
  teamId: undefined,
  isLoading: false,
};

export const reducer = (state = initState, action = {}) => {
  const { payload, type } = action;

  switch (type) {
    case SWAG_CODES_SETTINGS_ALL_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SWAG_CODES_SETTINGS_ALL_SETTINGS_SUCCESS:
      return {
        codeInventory: payload.batches,
        teamId: payload.teamId,
        isLoading: false,
      };
    case SWAG_SELECT_GENERATION_CODES_PROGRESS_FAIL:
      return {
        isLoading: false,
      };
    case SWAG_CODES_SETTINGS_BATCHES_UPDATING_START:
      return {
        ...state,
        isLoading: true,
      };
    case SWAG_CODES_SETTINGS_BATCHES_UPDATING_END:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return { ...state };
  }
};
