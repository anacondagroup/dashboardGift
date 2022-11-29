import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { propOr } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { BgOptions, IBrandingSettings } from '../emailBranding.types';
import { EmailType } from '../emailTypes/emailTypes.types';
import { loadEmailPreviewSuccess } from '../emailPreview/emailPreview.actions';

import {
  loadBrandingSettingsFail,
  loadBrandingSettingsRequest,
  loadBrandingSettingsSuccess,
  resetBrandingSettings,
  resetLogoImage,
  setBackgroundOption,
  setBrandingSettings,
  setEmailTypeId,
  updateBrandingSettingsFail,
  updateBrandingSettingsRequest,
  updateBrandingSettingsSuccess,
  uploadBrandingImageFail,
  uploadBrandingImageSuccess,
} from './brandingSettings.actions';
import { EMPTY_BRANDING_SETTINGS } from './brandingSettings.constants';

export interface IBrandingSettingsState {
  status: StateStatus;
  isSaveInProgress: boolean;
  settings: IBrandingSettings;
  initialSettings?: IBrandingSettings;
  emailTypeId: EmailType;
  isEmailTypeChanged: boolean;
  background: BgOptions;
  errors: TErrors;
}

export const initialState: IBrandingSettingsState = {
  status: StateStatus.Idle,
  isSaveInProgress: false,
  settings: EMPTY_BRANDING_SETTINGS,
  initialSettings: undefined,
  emailTypeId: EmailType.initialEmailSenderToRecipient,
  isEmailTypeChanged: true,
  background: BgOptions.empty,
  errors: {},
};

const reducer = createReducer<IBrandingSettingsState>({}, initialState);

reducer
  .on(loadBrandingSettingsRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(loadBrandingSettingsSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    settings: payload,
    initialSettings: payload,
    background: payload.headerItemsOpacity === 0 ? BgOptions.solid : BgOptions.alycePattern,
  }))
  .on(loadBrandingSettingsFail, state => ({
    ...state,
    status: StateStatus.Rejected,
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

reducer.on(setEmailTypeId, (state, payload) => ({
  ...state,
  emailTypeId: payload,
  isEmailTypeChanged: true,
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

reducer.on(loadEmailPreviewSuccess, state => ({
  ...state,
  isEmailTypeChanged: false,
}));

export default reducer;
