import {
  SWAG_CODES_SETTINGS_ALL_SETTINGS_FAIL,
  SWAG_CODES_SETTINGS_ALL_SETTINGS_REQUEST,
  SWAG_CODES_SETTINGS_ALL_SETTINGS_SUCCESS,
  SWAG_CODES_SETTINGS_BATCHES_UPDATING_END,
  SWAG_CODES_SETTINGS_BATCHES_UPDATING_START,
} from './swagBatches.types';

export const swagCodesSettingsAllSettingsRequest = payload => ({
  type: SWAG_CODES_SETTINGS_ALL_SETTINGS_REQUEST,
  payload,
});

export const swagCodesSettingsAllSettingsSuccess = payload => ({
  type: SWAG_CODES_SETTINGS_ALL_SETTINGS_SUCCESS,
  payload,
});

export const swagCodesSettingsAllSettingsFail = payload => ({
  type: SWAG_CODES_SETTINGS_ALL_SETTINGS_FAIL,
  payload,
});

export const swagCodesBatchesUpdatingStart = () => ({
  type: SWAG_CODES_SETTINGS_BATCHES_UPDATING_START,
});

export const swagCodesBatchesUpdatingEnd = () => ({
  type: SWAG_CODES_SETTINGS_BATCHES_UPDATING_END,
});
