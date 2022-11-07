import { TErrors } from '@alycecom/services';

import { reducer, initialState } from '../emailNotifications.reducer';
import {
  loadActiveIntegrationsFail,
  loadActiveIntegrationsRequest,
  loadActiveIntegrationsSuccess,
  loadEmailNotificationsSettingsFail,
  loadEmailNotificationsSettingsRequest,
  loadEmailNotificationsSettingsSuccess,
  setEmailNotificationsSettings,
  updateEmailNotificationsSettingsFail,
  updateEmailNotificationsSettingsRequest,
  updateEmailNotificationsSettingsSuccess,
} from '../emailNotifications.actions';

describe('Email Notifications reducer', () => {
  const errorPayload: TErrors = {
    field: ['error'],
  };
  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it(`Should handle ${loadActiveIntegrationsRequest} action`, () => {
    expect(reducer(undefined, loadActiveIntegrationsRequest())).toEqual({
      ...initialState,
      integrations: {
        isLoading: true,
        active: false,
      },
    });
  });

  it(`Should handle ${loadActiveIntegrationsSuccess} action`, () => {
    expect(reducer(undefined, loadActiveIntegrationsSuccess({ active: true }))).toEqual({
      ...initialState,
      integrations: {
        isLoading: false,
        active: true,
      },
    });
  });

  it(`Should handle ${loadActiveIntegrationsFail} action`, () => {
    expect(reducer(undefined, loadActiveIntegrationsFail())).toEqual({
      ...initialState,
      integrations: {
        isLoading: false,
        active: false,
      },
    });
  });

  it(`Should handle ${loadEmailNotificationsSettingsRequest} action`, () => {
    expect(reducer(undefined, loadEmailNotificationsSettingsRequest())).toEqual({
      ...initialState,
      isLoading: true,
      errors: undefined,
    });
  });

  it(`Should handle ${loadEmailNotificationsSettingsSuccess} action`, () => {
    expect(reducer(undefined, loadEmailNotificationsSettingsSuccess({ assist: true }))).toEqual({
      ...initialState,
      isLoading: false,
      data: {
        assist: true,
      },
    });
  });

  it(`Should handle ${loadEmailNotificationsSettingsFail} action`, () => {
    expect(reducer(undefined, loadEmailNotificationsSettingsFail(errorPayload))).toEqual({
      ...initialState,
      isLoading: false,
      errors: errorPayload,
    });
  });

  it(`Should handle ${setEmailNotificationsSettings} action`, () => {
    expect(reducer(undefined, setEmailNotificationsSettings({ assist: true }))).toEqual({
      ...initialState,
      isLoading: false,
      data: {
        assist: true,
      },
    });
  });

  it(`Should handle ${updateEmailNotificationsSettingsRequest} action`, () => {
    expect(reducer(undefined, updateEmailNotificationsSettingsRequest())).toEqual({
      ...initialState,
      isLoading: true,
      errors: undefined,
    });
  });

  it(`Should handle ${updateEmailNotificationsSettingsSuccess} action`, () => {
    expect(reducer(undefined, updateEmailNotificationsSettingsSuccess())).toEqual({
      ...initialState,
      isLoading: false,
    });
  });

  it(`Should handle ${updateEmailNotificationsSettingsFail} action`, () => {
    expect(reducer(undefined, updateEmailNotificationsSettingsFail(errorPayload))).toEqual({
      ...initialState,
      isLoading: false,
      errors: errorPayload,
    });
  });
});
