import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { propOr } from 'ramda';

import { BgOptions, IBrandingSettings } from '../emailBranding.types';

import {
  loadBrandingSettingsFail,
  loadBrandingSettingsRequest,
  loadBrandingSettingsSuccess,
  resetBrandingSettings,
  setBackgroundOption,
  setBrandingSettings,
  uploadBrandingImageSuccess,
  uploadBrandingImageFail,
  resetLogoImage,
  updateBrandingSettingsRequest,
  updateBrandingSettingsSuccess,
  updateBrandingSettingsFail,
} from './brandingSettings.actions';
import { EMPTY_BRANDING_SETTINGS } from './brandingSettings.constants';

export interface IBrandingSettingsState {
  isLoading: boolean;
  isLoaded: boolean;
  isSaveInProgress: boolean;
  settings: IBrandingSettings;
  initialSettings?: IBrandingSettings;
  background: BgOptions;
  errors: TErrors;
}

export const initialState: IBrandingSettingsState = {
  isLoading: false,
  isLoaded: false,
  isSaveInProgress: false,
  settings: EMPTY_BRANDING_SETTINGS,
  initialSettings: undefined,
  background: BgOptions.empty,
  errors: {},
};

const reducer = createReducer<IBrandingSettingsState>({}, initialState);

reducer
  .on(loadBrandingSettingsRequest, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  }))
  .on(loadBrandingSettingsSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    settings: payload,
    initialSettings: payload,
    background: payload.headerItemsOpacity === 0 ? BgOptions.solid : BgOptions.alycePattern,
  }))
  .on(loadBrandingSettingsFail, state => ({
    ...state,
    isLoading: false,
    isLoaded: false,
  }));

reducer
  .on(uploadBrandingImageSuccess, (state, payload) => ({
    ...state,
    settings: {
      ...state.settings,
      companyLogoUrl: payload.url,
      companyLogoId: payload.id,
    },
  }))
  .on(uploadBrandingImageFail, (state, payload) => ({
    ...state,
    errors: payload,
  }));

reducer.on(setBackgroundOption, (state, payload) => ({
  ...state,
  background: payload,
}));

reducer.on(setBrandingSettings, (state, payload) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload,
  },
}));

reducer.on(resetBrandingSettings, state => ({
  ...state,
  ...initialState,
}));

reducer.on(resetLogoImage, state => ({
  ...state,
  settings: {
    ...state.settings,
    companyLogoUrl: propOr('', 'companyLogoUrl', state.initialSettings),
    companyLogoId: propOr(0, 'companyLogoId', state.initialSettings),
  },
}));

reducer
  .on(updateBrandingSettingsRequest, state => ({
    ...state,
    isSaveInProgress: true,
  }))
  .on(updateBrandingSettingsSuccess, (state, payload) => ({
    ...state,
    isSaveInProgress: false,
    settings: payload,
    initialSettings: payload,
    background: payload.headerItemsOpacity === 0 ? BgOptions.solid : BgOptions.alycePattern,
  }))
  .on(updateBrandingSettingsFail, (state, payload) => ({
    ...state,
    isSaveInProgress: false,
    errors: payload,
  }));

export default reducer;
