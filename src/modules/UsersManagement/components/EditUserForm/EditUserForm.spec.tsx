import React from 'react';

import { render, screen, userEvent, waitFor } from '../../../../testUtils';

import { IUser, UserRoles } from '../../store/usersManagement.types';
import EditUserForm from './EditUserForm';
import { initialUsersOperationState, IUsersOperationState } from '../../store/usersOperation/usersOperation.reducer';
import { initialState, TTeamsState } from '../../store/entities/teams/teams.reducer';

describe.skip('EditUserForm', () => {
  const setup = (
    state: Partial<{
      usersOperation: Partial<IUsersOperationState>;
      teams: Partial<TTeamsState>;
    }>,
  ) =>
    render(<EditUserForm />, {
      initialState: {
        usersManagement: {
          usersOperation: {
            ...initialUsersOperationState,
            ...state.usersOperation,
          },
          teams: {
            ...initialState,
            ...state.teams,
          },
        },
      },
    });

  test('Should not allow to make user a member when user is last admin', async () => {
    setup({
      usersOperation: {
        singleSelectedUser: {
          id: 101,
          firstName: 'User 101',
          teams: [
            {
              id: 1,
              name: 'Team 1',
              access: UserRoles.admin,
              isLastAdmin: true,
            },
            {
              id: 2,
              name: 'Team 2',
              access: UserRoles.member,
            },
          ],
          isLastAdmin: true,
        } as IUser,
      },
      teams: {
        entities: {
          1: {
            id: 1,
            name: 'Team 1',
          },
          2: {
            id: 2,
            name: 'Team 2',
          },
          3: {
            id: 3,
            name: 'Team 3',
          },
        },
      },
    });

    const roleSelect = screen.getByTestId(`UsersManagement.Edit.RoleSelect`);
    expect(roleSelect).toHaveTextContent('Admin');

    const saveBtn = screen.getByTestId(`UsersManagement.Edit.Save`);
    await waitFor(() => {
      expect(saveBtn).toBeEnabled();
    });

    userEvent.click(roleSelect.children[0]);
    const memberItem = screen.getByTestId(`UsersManagement.Edit.RoleSelect.member`);
    expect(memberItem).toBeInTheDocument();
    userEvent.click(memberItem);

    await waitFor(() => {
      expect(saveBtn).toBeDisabled();
    });
  });

  test('Should not allow to remove from team where user is last admin', async () => {
    setup({
      usersOperation: {
        singleSelectedUser: {
          id: 101,
          firstName: 'User 101',
          teams: [
            {
              id: 1,
              name: 'Team 1',
              access: UserRoles.admin,
              isLastAdmin: true,
            },
            {
              id: 2,
              name: 'Team 2',
              access: UserRoles.member,
            },
          ],
          isLastAdmin: true,
        } as IUser,
      },
      teams: {
        entities: {
          1: {
            id: 1,
            name: 'Team 1',
          },
          2: {
            id: 2,
            name: 'Team 2',
          },
          3: {
            id: 3,
            name: 'Team 3',
          },
        },
      },
    });

    const saveBtn = screen.getByTestId(`UsersManagement.Edit.Save`);
    await waitFor(() => {
      expect(saveBtn).toBeEnabled();
    });

    const removeFirstTeamBtn = screen
      .getByTestId(`UsersManagement.Edit.TeamsSelect`)
      .querySelector('[role="button"] svg');
    userEvent.click(removeFirstTeamBtn!);

    await waitFor(() => {
      expect(saveBtn).toBeDisabled();
    });
  });
});
