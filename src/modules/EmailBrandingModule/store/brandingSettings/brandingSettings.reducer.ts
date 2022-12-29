import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { propOr } from 'ramda';
import { appApi } from '@alycecom/services';

import { BgOptions, IBrandingSettings } from '../emailBranding.types';
import { EmailType } from '../../constants/emailTypes.constants';

import { EMPTY_BRANDING_SETTINGS } from './brandingSettings.constants';

export type TBrandingSettingsState = {
  settings: IBrandingSettings;
  initialSettings?: IBrandingSettings;
  emailTypeId: EmailType;
  isEmailTypeChanged: boolean;
  background: BgOptions;
};

const initialState: TBrandingSettingsState = {
  settings: EMPTY_BRANDING_SETTINGS,
  initialSettings: undefined,
  emailTypeId: EmailType.initialEmailSenderToRecipient,
  isEmailTypeChanged: true,
  background: BgOptions.empty,
};

export const {
  name,
  reducer: brandingSettings,
  actions: { setBrandingSettings, setEmailTypeId, setBackgroundOption, resetLogoImage },
  getInitialState,
} = createSlice({
  name: 'brandingSettings' as const,
  initialState,
  reducers: {
    setBrandingSettings: (state, { payload }: PayloadAction<Partial<IBrandingSettings>>) => ({
      ...state,
      settings: {
        ...state.settings,
        ...payload,
      },
    }),
    setEmailTypeId: (state, { payload }: PayloadAction<EmailType>) => ({
      ...state,
      emailTypeId: payload,
      isEmailTypeChanged: true,
    }),
    setBackgroundOption: (state, { payload }: PayloadAction<BgOptions>) => ({
      ...state,
      background: payload,
    }),
    resetLogoImage: state => ({
      ...state,
      settings: {
        ...state.settings,
        companyLogoUrl: propOr('', 'companyLogoUrl', state.initialSettings),
        companyLogoId: propOr(0, 'companyLogoId', state.initialSettings),
      },
    }),
  },
  extraReducers: builder =>
    builder
      .addMatcher(appApi.endpoints.getBrandingSettingsByTeamId.matchFulfilled, (state, { payload }) => ({
        ...state,
        settings: {
          ...state.settings,
          ...payload,
        },
        initialSettings: {
          ...state.initialSettings,
          ...payload,
        },
        background: payload.headerItemsOpacity === 0 ? BgOptions.solid : BgOptions.alycePattern,
      }))
      .addMatcher(appApi.endpoints.putBrandingSettings.matchFulfilled, (state, { payload }) => ({
        ...state,
        settings: {
          ...state.settings,
          ...payload,
        },
        initialSettings: {
          ...state.initialSettings,
          ...payload,
        },
      }))
      .addMatcher(appApi.endpoints.uploadBrandingImage.matchFulfilled, (state, { payload }) => ({
        ...state,
        settings: {
          ...state.settings,
          companyLogoUrl: payload.url,
          companyLogoId: payload.id,
        },
      }))
      .addMatcher(appApi.endpoints.getEmailPreview.matchFulfilled, state => ({
        ...state,
        isEmailTypeChanged: false,
      })),
});
