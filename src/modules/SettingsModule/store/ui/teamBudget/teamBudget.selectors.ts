import { appApi } from '@alycecom/services';
import { EntityId } from '@alycecom/utils';
import { pipe } from 'ramda';
import { RootStateOrAny } from 'react-redux';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../../store/root.types';
import { IUser } from '../../../../UsersManagement/store/usersManagement.types';

import { name } from './teamBudget.reducer';

const getTeamBudgetState = (state: IRootState) => state.settings.ui[name];

export const getIsAllUsersSelected = pipe(getTeamBudgetState, state => state.isAllUsersSelected);

export const getSelectedUsersIds = pipe(getTeamBudgetState, state => state.selectedUserIds);

export const makeGetSelectedUsersByTeamId = (teamId: string): ((state: RootStateOrAny) => IUser[]) =>
  createSelector(
    getSelectedUsersIds,
    appApi.endpoints.getTeamMembers.select({ teamId }),
    (selectedUserIds, teamMembers) => {
      const teamMembersItems = teamMembers?.data?.entities ? Object.values(teamMembers.data.entities) : [];
      return teamMembersItems.filter(user =>
        selectedUserIds.some((id: EntityId) => user?.id === Number(id)),
      ) as IUser[];
    },
  );
