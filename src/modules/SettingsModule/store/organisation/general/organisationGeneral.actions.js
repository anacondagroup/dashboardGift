import {
  ORGANISATION_SETTINGS,
  ORGANISATION_SETTINGS_UPDATE_NAME,
  ORGANISATION_SETTINGS_UPDATE_LOGO,
  ORGANISATION_SETTINGS_REMOVE_LOGO,
} from './organisationGeneral.types';

export const organisationSettingsLoadRequest = () => ({
  type: ORGANISATION_SETTINGS.REQUEST,
});

export const organisationSettingsLoadSuccess = settings => ({
  type: ORGANISATION_SETTINGS.SUCCESS,
  payload: settings,
});

export const organisationSettingsLoadFail = error => ({
  type: ORGANISATION_SETTINGS.FAIL,
  payload: error,
});

export const organisationSettingsUpdateNameRequest = name => ({
  type: ORGANISATION_SETTINGS_UPDATE_NAME.REQUEST,
  payload: name,
});

export const organisationSettingsUpdateNameSuccess = name => ({
  type: ORGANISATION_SETTINGS_UPDATE_NAME.SUCCESS,
  payload: name,
});

export const organisationSettingsUpdateNameFail = errors => ({
  type: ORGANISATION_SETTINGS_UPDATE_NAME.FAIL,
  payload: errors,
});

export const organisationSettingsLogoUploadRequest = data => ({
  type: ORGANISATION_SETTINGS_UPDATE_LOGO.REQUEST,
  payload: data,
});

export const organisationSettingsLogoUpdateSuccess = image => ({
  type: ORGANISATION_SETTINGS_UPDATE_LOGO.SUCCESS,
  payload: image,
});

export const organisationSettingsLogoRemoveRequest = () => ({
  type: ORGANISATION_SETTINGS_REMOVE_LOGO.REQUEST,
});
