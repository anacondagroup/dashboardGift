import React from 'react';

import { render, screen, userEvent, waitFor } from '../../../../testUtils';
import { IConfirmationState, initialConfirmationState } from '../../store/confirmation.reducer';
import { setNewPasswordRequest } from '../../store/confirmation.actions';

import AuthConfirmationPage, { IAuthConfirmationPageProps } from './AuthConfirmationPage';

describe('AuthConfirmationPage', () => {
  const setup = (props: IAuthConfirmationPageProps, confirmationState: IConfirmationState) =>
    render(<AuthConfirmationPage {...props} />, {
      initialState: {
        confirmation: confirmationState,
      },
    });

  test('Should render user info from id token', () => {
    setup(
      {
        idToken:
          '420129156a90fd3de06378ac86fff55cd53961a9.eyJ1c2VyTmFtZSI6ICLQmdGG0YPQutC10L0iLCAidXNlckVtYWlsIjogInF3ZXJ0eUBhbHljZS5jb20ifQ%3D%3D',
      },
      {
        ...initialConfirmationState,
      },
    );

    expect(screen.getByTestId('AuthConfirmationPage.UserName')).toHaveTextContent(/^Йцукен$/);
    expect(screen.getByTestId('AuthConfirmationPage.UserEmail')).toHaveTextContent(/^qwerty@alyce.com$/);
  });

  test('Should trigger request with password and token', async () => {
    const { dispatch } = setup(
      {
        idToken:
          '420129156a90fd3de06378ac86fff55cd53961a9.eyJ1c2VyTmFtZSI6ICLQmdGG0YPQutC10L0iLCAidXNlckVtYWlsIjogInF3ZXJ0eUBhbHljZS5jb20ifQ%3D%3D',
      },
      {
        ...initialConfirmationState,
      },
    );

    userEvent.type(screen.getByTestId('AuthConfirmation.NewPassword'), 'User4dev!');
    userEvent.type(screen.getByTestId('AuthConfirmation.NewPasswordConfirm'), 'User4dev!');
    userEvent.click(screen.getByTestId('AuthConfirmation.Submit'));

    await waitFor(() => {
      expect(dispatch).toBeCalledWith(
        setNewPasswordRequest({
          password: 'User4dev!',
          passwordConfirmation: 'User4dev!',
          token: '420129156a90fd3de06378ac86fff55cd53961a9',
        }),
      );
    });
  });
});
