import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IBrandingSettings, BgOptions, IUploadImageParams, TBrandingSettingsErrors } from '../emailBranding.types';

const PREFIX = 'EMAIL_BRANDING/SETTINGS';

export const loadBrandingSettingsRequest = createAction<{ teamId: number }>(`${PREFIX}/LOAD_BRANDING_SETTINGS_REQUEST`);
export const loadBrandingSettingsSuccess = createAction<IBrandingSettings>(`${PREFIX}/LOAD_BRANDING_SETTINGS_SUCCESS`);
export const loadBrandingSettingsFail = createAction(`${PREFIX}/LOAD_BRANDING_SETTINGS_FAIL`);

export const uploadBrandingImageRequest = createAction<IUploadImageParams>(`${PREFIX}/UPLOAD_BRANDING_IMAGE_REQUEST`);
export const uploadBrandingImageSuccess = createAction<{ id: number; url: string }>(
  `${PREFIX}/UPLOAD_BRANDING_IMAGE_SUCCESS`,
);
export const uploadBrandingImageFail = createAction<TErrors<TBrandingSettingsErrors>>(
  `${PREFIX}/UPLOAD_BRANDING_IMAGE_FAIL`,
);

export const updateBrandingSettingsRequest = createAction<{ teamId: number; settings: IBrandingSettings }>(
  `${PREFIX}/LOAD_BRANDING_SETTINGS_REQUEST`,
);
export const updateBrandingSettingsSuccess = createAction<IBrandingSettings>(
  `${PREFIX}/LOAD_BRANDING_SETTINGS_SUCCESS`,
);
export const updateBrandingSettingsFail = createAction<TErrors<TBrandingSettingsErrors>>(
  `${PREFIX}/LOAD_BRANDING_SETTINGS_FAIL`,
);

export const setBackgroundOption = createAction<BgOptions>(`${PREFIX}/SET_BACKGROUND_OPTION`);
export const setBrandingSettings = createAction<Partial<IBrandingSettings>>(`${PREFIX}/SET_BRANDING_SETTINGS`);
export const resetBrandingSettings = createAction(`${PREFIX}/RESET_BRANDING_SETTINGS`);
export const resetLogoImage = createAction(`${PREFIX}/RESET_LOGO_IMAGE`);
