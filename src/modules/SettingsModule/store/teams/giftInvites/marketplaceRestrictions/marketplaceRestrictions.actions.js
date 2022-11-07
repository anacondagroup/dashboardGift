import {
  TEAM_GIFT_INVITES_SETTINGS_FAIL,
  TEAM_GIFT_INVITES_SETTINGS_REQUEST,
  TEAM_GIFT_INVITES_SETTINGS_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_SUCCESS,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_FAIL,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_SUCCESS,
} from './marketplaceRestrictions.types';

export const teamGiftInvitesSettingRequest = payload => ({
  type: TEAM_GIFT_INVITES_SETTINGS_REQUEST,
  payload,
});

export const teamGiftInvitesSettingSuccess = payload => ({
  type: TEAM_GIFT_INVITES_SETTINGS_SUCCESS,
  payload,
});

export const teamGiftInvitesSettingsFail = error => ({
  type: TEAM_GIFT_INVITES_SETTINGS_FAIL,
  payload: error,
});

export const teamSettingsGiftInvitesTypesRequest = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_TYPES_REQUEST,
  payload,
});

export const teamSettingsGiftInvitesTypesSuccess = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_TYPES_SUCCESS,
  payload,
});

export const teamSettingsGiftInvitesTypesFail = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_TYPES_FAIL,
  payload,
});

export const teamSettingsGiftInvitesUpdateTypesRequest = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_REQUEST,
  payload,
});

export const teamSettingsGiftInvitesUpdateTypesSuccess = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_SUCCESS,
  payload,
});

export const teamSettingsGiftInvitesUpdateTypesFail = error => ({
  type: TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_FAIL,
  payload: error,
});

export const teamSettingsGiftInvitesVendorsRequest = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_VENDORS_REQUEST,
  payload,
});

export const teamSettingsGiftInvitesVendorsSuccess = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_VENDORS_SUCCESS,
  payload,
});

export const teamSettingsGiftInvitesVendorsFail = error => ({
  type: TEAM_SETTINGS_GIFT_INVITES_VENDORS_FAIL,
  payload: error,
});

export const teamSettingsGiftInvitesUpdateVendorsRequest = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_REQUEST,
  payload,
});

export const teamSettingsGiftInvitesUpdateVendorsSuccess = payload => ({
  type: TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_SUCCESS,
  payload,
});

export const teamSettingsGiftInvitesUpdateVendorsFail = error => ({
  type: TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_FAIL,
  payload: error,
});
