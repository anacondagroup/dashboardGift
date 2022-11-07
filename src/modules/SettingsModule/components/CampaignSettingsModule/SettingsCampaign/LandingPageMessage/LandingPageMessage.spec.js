import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../../../../testUtils';
import useLandingPageSettings from '../../../../hooks/useLandingPageSettings';

import { LandingPageMessage } from './LandingPageMessage';

jest.mock('../../../../hooks/useLandingPageSettings', () => jest.fn());

describe('LandingPageMessage(RTL)', () => {
  let onSaveMock;

  const setup = props => {
    const utils = render(<LandingPageMessage campaignId={123} {...props} />);
    const getHeaderField = () => screen.getByPlaceholderText('Landing page header');
    const getMessageField = () => screen.getByPlaceholderText('Landing page message');
    const getSaveButton = () => screen.getByRole('button', { name: /Save/i });

    return {
      ...utils,
      getHeaderField,
      getMessageField,
      getSaveButton,
    };
  };

  beforeEach(() => {
    useLandingPageSettings.mockReturnValue({
      settings: {
        header: '',
        message: '',
      },
      errors: {},
      isLoading: false,
      onSave: onSaveMock,
    });
  });

  it('Should disable save button when fields are empty', () => {
    const { getSaveButton } = setup();
    expect(getSaveButton()).toBeDisabled();
  });

  it('Should available save button to click if fields are filled', async () => {
    const { getHeaderField, getMessageField, getSaveButton } = setup();

    userEvent.type(getHeaderField(), 'Header');
    userEvent.type(getMessageField(), 'Message');

    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
