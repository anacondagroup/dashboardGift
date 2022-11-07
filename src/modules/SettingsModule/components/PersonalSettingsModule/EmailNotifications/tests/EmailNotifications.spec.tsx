import React from 'react';

import { render, userEvent, screen } from '../../../../../../testUtils';
import EmailNotifications from '../EmailNotifications';
import {
  loadActiveIntegrationsRequest,
  loadEmailNotificationsSettingsRequest,
  setEmailNotificationsSettings,
  updateEmailNotificationsSettingsRequest,
} from '../../../../store/personal/emailNotifications/emailNotifications.actions';
import {
  initialState as emailNotificationsInitialState,
  IEmailNotificationsState,
} from '../../../../store/personal/emailNotifications/emailNotifications.reducer';
import { IAssistEmailSettingsPropTypes } from '../AssistEmailSettings';

jest.mock('../AssistEmailSettings', () => ({ isAssistEnabled, onChange, disabled }: IAssistEmailSettingsPropTypes) => (
  <div>
    <div>AlyceAssistEmailSettings</div>
    {isAssistEnabled && <div>Enabled</div>}
    {disabled && <div>Disabled</div>}
    <button type="button" onClick={() => onChange(true)}>
      Update Assist
    </button>
  </div>
));
jest.mock('../../../../store/personal/emailNotifications/emailNotifications.actions', () => ({
  updateEmailNotificationsSettingsRequest: jest.fn(),
  loadEmailNotificationsSettingsRequest: jest.fn(),
  setEmailNotificationsSettings: jest.fn(),
  loadActiveIntegrationsRequest: jest.fn(),
}));

describe('EmailNotifications', () => {
  const setup = (state?: Partial<IEmailNotificationsState>) => {
    const initialState = {
      settings: {
        personal: {
          emailNotifications: {
            ...emailNotificationsInitialState,
            ...state,
          },
        },
      },
    };
    const utils = render(<EmailNotifications />, { initialState });
    const getSaveButton = () => screen.getByRole('button', { name: /Save/ });
    return {
      ...utils,
      getSaveButton,
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should render without errors', () => {
    const { getSaveButton } = setup();
    expect(getSaveButton()).toBeDisabled();
  });

  it('Should render Alyce Assist setting section', () => {
    const { getByText } = setup();
    expect(getByText('AlyceAssistEmailSettings')).toBeInTheDocument();
  });

  it('Should request active integrations uploading on component mount', () => {
    setup();
    expect(loadActiveIntegrationsRequest).toHaveBeenCalledTimes(1);
  });

  it('Should request email notifications settings uploading once isIntegrationActive is true', () => {
    setup({ integrations: { isLoading: false, active: true } });
    expect(loadEmailNotificationsSettingsRequest).toHaveBeenCalledTimes(1);
  });

  it('Should pass isAssistEnabled prop down to AssistEmailSettings component', () => {
    const { getByText } = setup({ data: { assist: true } });
    expect(getByText('Enabled')).toBeInTheDocument();
  });

  it('Should call setEmailNotificationsSettings action on Assist Settings change', () => {
    const { getByRole } = setup();
    const updateAssistButton = getByRole('button', { name: /Update Assist/ });

    userEvent.click(updateAssistButton);

    expect(setEmailNotificationsSettings).toHaveBeenCalledWith({ assist: true });
  });

  it('Should disable Save button while settings is being loaded', () => {
    const { getSaveButton } = setup({ isLoading: true });
    expect(getSaveButton()).toBeDisabled();
  });

  it('Should disable Save button while active integrations are being loaded', () => {
    const { getSaveButton } = setup({ integrations: { isLoading: true, active: false } });
    expect(getSaveButton()).toBeDisabled();
  });

  it('Should disable Save button when there is no active integrations', () => {
    const { getSaveButton } = setup({ integrations: { isLoading: false, active: false } });
    expect(getSaveButton()).toBeDisabled();
  });

  it('Should call updateEmailNotificationsSettingsRequest action on Save btn click', () => {
    const { getSaveButton } = setup({ integrations: { isLoading: false, active: true } });

    userEvent.click(getSaveButton());

    expect(updateEmailNotificationsSettingsRequest).toHaveBeenCalledTimes(1);
  });
});
