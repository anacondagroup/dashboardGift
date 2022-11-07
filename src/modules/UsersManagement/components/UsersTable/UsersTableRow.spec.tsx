import React from 'react';
import { initialUserState, IUserState } from '@alycecom/modules';

import { render, screen, userEvent, waitFor } from '../../../../testUtils';

import UsersTableRow, { IUsersTableRowProps } from './UsersTableRow';
import { IUser, UserRoles } from '../../store/usersManagement.types';

describe('UsersTableRow', () => {
  const setup = (
    props: IUsersTableRowProps<IUser>,
    state: Partial<{
      user: Partial<IUserState>;
    }>,
  ) =>
    render(<UsersTableRow {...props} />, {
      initialState: {
        modules: {
          user: {
            ...initialUserState,
            ...state.user,
          },
        },
      },
    });

  describe('Actions', () => {
    test('Should allow actions over logged user', () => {
      setup(
        {
          rowItem: {
            id: 101,
            firstName: 'User 101',
            teams: [
              {
                id: 1,
                access: UserRoles.member,
              },
            ],
          } as IUser,
          isSelected: false,
          onOpenAssignToTeamModal: () => undefined,
          onOpenRemoveFromTeamModal: () => undefined,
          onMakeTeamAdmin: () => undefined,
          onMakeTeamMember: () => undefined,
          onEditUser: () => undefined,
          onSelectUser: () => undefined,
        },
        {
          user: {
            id: 101,
          },
        },
      );

      const checkbox = screen.getByTestId(`UsersManagement.Table.101.Checkbox`);
      expect(checkbox).toBeEnabled();
      expect(checkbox).not.toBeChecked();
    });

    test('Should not allow to remove logged user', async () => {
      const onRemoveMock = jest.fn();
      setup(
        {
          rowItem: {
            id: 101,
            firstName: 'User 101',
            teams: [
              {
                id: 1,
                access: UserRoles.member,
              },
            ],
          } as IUser,
          isSelected: false,
          onOpenAssignToTeamModal: () => undefined,
          onOpenRemoveFromTeamModal: onRemoveMock,
          onMakeTeamAdmin: () => undefined,
          onMakeTeamMember: () => undefined,
          onEditUser: () => undefined,
          onSelectUser: () => undefined,
        },
        {
          user: {
            id: 101,
          },
        },
      );

      userEvent.hover(screen.getByTestId(`UsersManagement.Table.101`));
      userEvent.click(screen.getByTestId(`UsersManagement.Table.101.Actions`));

      const removeBtn = screen.queryByTestId(`UsersManagement.Table.101.Actions.Remove`);
      await waitFor(() => {
        expect(removeBtn).toBeInTheDocument();
      });
      userEvent.click(removeBtn as Element, undefined, { skipPointerEventsCheck: true });

      expect(onRemoveMock).not.toBeCalled();
    });

    test.skip('Should not allow to remove last admin', async () => {
      const onRemoveMock = jest.fn();
      setup(
        {
          rowItem: {
            id: 101,
            firstName: 'User 101',
            teams: [
              {
                id: 1,
                access: UserRoles.admin,
              },
            ],
            isLastAdmin: true,
          } as IUser,
          isSelected: false,
          onOpenAssignToTeamModal: () => undefined,
          onOpenRemoveFromTeamModal: onRemoveMock,
          onMakeTeamAdmin: () => undefined,
          onMakeTeamMember: () => undefined,
          onEditUser: () => undefined,
          onSelectUser: () => undefined,
        },
        {
          user: {
            id: 100,
          },
        },
      );

      userEvent.hover(screen.getByTestId(`UsersManagement.Table.101`));
      userEvent.click(screen.getByTestId(`UsersManagement.Table.101.Actions`));

      const removeBtn = screen.queryByTestId(`UsersManagement.Table.101.Actions.Remove`);
      await waitFor(() => {
        expect(removeBtn).toBeInTheDocument();
      });
      userEvent.click(removeBtn as Element);

      expect(onRemoveMock).not.toBeCalled();
    });

    test.skip('Should not allow to revoke last admin', async () => {
      const onRevokeAdminMock = jest.fn();
      setup(
        {
          rowItem: {
            id: 101,
            firstName: 'User 101',
            teams: [
              {
                id: 1,
                access: UserRoles.admin,
              },
            ],
            isLastAdmin: true,
          } as IUser,
          isSelected: false,
          onOpenAssignToTeamModal: () => undefined,
          onOpenRemoveFromTeamModal: () => undefined,
          onMakeTeamAdmin: onRevokeAdminMock,
          onMakeTeamMember: () => undefined,
          onEditUser: () => undefined,
          onSelectUser: () => undefined,
        },
        {
          user: {
            id: 100,
          },
        },
      );

      userEvent.hover(screen.getByTestId(`UsersManagement.Table.101`));
      userEvent.click(screen.getByTestId(`UsersManagement.Table.101.Actions`));

      const revokeBtn = screen.queryByTestId(`UsersManagement.Table.101.Actions.RevokeAdmin`);
      await waitFor(() => {
        expect(revokeBtn).toBeInTheDocument();
      });
      userEvent.click(revokeBtn as Element);

      expect(onRevokeAdminMock).not.toBeCalled();
    });
  });
});
