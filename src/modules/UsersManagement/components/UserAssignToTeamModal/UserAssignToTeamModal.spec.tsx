import React from 'react';

import { render, screen, userEvent, waitFor } from '../../../../testUtils';

import { IUser, UserRoles } from '../../store/usersManagement.types';
import { initialUsersOperationState, IUsersOperationState } from '../../store/usersOperation/usersOperation.reducer';
import { initialState, TTeamsState } from '../../store/entities/teams';
import UserAssignToTeamModal from './UserAssignToTeamModal';

describe.skip('UserAssignToTeamModal', () => {
  const setup = (
    state: Partial<{
      usersOperation: Partial<IUsersOperationState>;
      teams: Partial<TTeamsState>;
    }>,
  ) =>
    render(<UserAssignToTeamModal isOpen />, {
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

  test('Should allow to remove from team when user is not last admin', async () => {
    setup({
      usersOperation: {
        selectedUsers: [
          {
            id: 101,
            firstName: 'User 101',
            teams: [
              {
                id: 1,
                name: 'Team 1',
                access: UserRoles.admin,
              },
              {
                id: 2,
                name: 'Team 2',
                access: UserRoles.member,
              },
            ],
            isLastAdmin: true,
          } as IUser,
        ],
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

    const removeFirstTeamBtn = screen
      .getByTestId(`UsersManagement.AssignToTeam.TeamsSelect`)
      .querySelector('[role="button"] svg');
    userEvent.click(removeFirstTeamBtn!);

    const submitBtn = screen.getByTestId(`modalConfirmationSubmitButton`);
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });
  });

  test('Should not allow to remove from team where user is last admin', async () => {
    setup({
      usersOperation: {
        selectedUsers: [
          {
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
        ],
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

    const submitBtn = screen.getByTestId(`modalConfirmationSubmitButton`);
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });

    const removeFirstTeamBtn = screen
      .getByTestId(`UsersManagement.AssignToTeam.TeamsSelect`)
      .querySelector('[role="button"] svg');
    userEvent.click(removeFirstTeamBtn!);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });
});
