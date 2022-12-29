import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Tooltip, Icon, Divider, SearchField } from '@alycecom/ui';
import { Control } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { TBudgetCreateParams, useGetTeamMembersQuery } from '@alycecom/services';

import { TEAM_MEMBERS_TOOLTIP_MESSAGE } from '../../../../../constants/budget.constants';
import { IUser } from '../../../../../../UsersManagement/store/usersManagement.types';
import { loadTeamBudgetUtilization } from '../../../../../../../store/budgetUtilization/budgetUtilization.actions';
import { resetUsersSelection } from '../../../../../store/ui/teamBudget/teamBudget.reducer';
import { getBudgetByTeamId } from '../../../../../store/teams/budgets/budgets.selectors';

import TeamMembersTable from './TeamMembersBudgetTable';
import TeamMembersBudgetFooter from './TeamMembersBudgetFooter';
import { styles } from './TeamMembersBudget.styles';

export interface ITeamMembersBudgetProps {
  teamId: number;
  control: Control<TBudgetCreateParams>;
}

function getSearchedMembers(users: IUser[], searchValue: string): IUser[] {
  return users.filter(user =>
    `${user.firstName}${user.lastName}${user.email}`.toLowerCase().includes(searchValue.toLowerCase()),
  );
}

const TeamMembersBudget = ({ teamId, control }: ITeamMembersBudgetProps): JSX.Element => {
  const dispatch = useDispatch();
  const existingBudget = useSelector(useMemo(() => getBudgetByTeamId(teamId), [teamId]));

  const [searchValue, setSearchValue] = useState('');
  const handleOnChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value);

  const { searchedTeamMembers, isSuccess: teamMembersHaveLoaded, refetch, isFetching } = useGetTeamMembersQuery(
    { teamId: teamId?.toString() ?? '' },
    {
      selectFromResult: result => {
        const entitiesAsUsers = Object.values(result.data?.entities ?? []) as IUser[];
        return {
          ...result,
          searchedTeamMembers: getSearchedMembers(entitiesAsUsers, searchValue),
        };
      },
    },
  );

  useEffect(() => {
    refetch();

    if (teamId && existingBudget) {
      dispatch(loadTeamBudgetUtilization({ teamId }));
    }
  }, [dispatch, refetch, teamId, existingBudget]);

  useEffect(() => {
    dispatch(resetUsersSelection());
  }, [dispatch]);

  return (
    <Box data-testid="TeamMembersBudget">
      <Box sx={styles.headContainer}>
        <Typography sx={styles.header}>Team members budget</Typography>
        <Tooltip title={TEAM_MEMBERS_TOOLTIP_MESSAGE}>
          <Icon icon="info-circle" sx={styles.icon} />
        </Tooltip>
      </Box>
      <Divider color="divider" height={2} mt={1} mb={1} />
      <Box sx={styles.searchContainer}>
        <SearchField placeholder="Search member" value={searchValue} onChange={handleOnChangeSearch} />
      </Box>
      <Box sx={styles.tableContainer}>
        <Box sx={styles.tableScroll}>
          <TeamMembersTable
            users={searchedTeamMembers}
            teamId={teamId ?? 0}
            teamMembersHaveLoaded={teamMembersHaveLoaded && !isFetching}
            control={control}
          />
        </Box>
        <TeamMembersBudgetFooter existingBudget={existingBudget} />
      </Box>
    </Box>
  );
};

export default TeamMembersBudget;
