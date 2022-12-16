import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Tooltip, Icon, Divider, SearchField } from '@alycecom/ui';
import { Control } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshPeriod, TBudgetCreateParams, useGetTeamMembersQuery } from '@alycecom/services';

import { TEAM_MEMBERS_TOOLTIP_MESSAGE } from '../../../../../constants/budget.constants';
import { IBudget } from '../../../../../store/teams/budgets/budgets.types';
import { IUser } from '../../../../../../UsersManagement/store/usersManagement.types';
import { loadTeamBudgetUtilization } from '../../../../../../../store/budgetUtilization/budgetUtilization.actions';
import { resetUsersSelection } from '../../../../../store/ui/teamBudget/teamBudget.reducer';
import {
  getMembersWithUtilization,
  getTeamBudgetUtilization,
  getTeamBudgetUtilizationTotal,
} from '../../../../../../../store/budgetUtilization/budgetUtilization.selectors';

import TeamMembersTable from './TeamMembersBudgetTable';
import TeamMembersBudgetFooter from './TeamMembersBudgetFooter';
import { styles } from './TeamMembersBudget.styles';

export interface ITeamMembersBudgetProps {
  teamId: number | null;
  control: Control<TBudgetCreateParams>;
  refreshPeriod: RefreshPeriod;
  onMemberBudgetDefinition: () => void;
  memberBudgetsTotal: number;
  existingBudget?: IBudget;
}

function getSearchedMembers(users: IUser[], searchValue: string): IUser[] {
  return users.filter(user =>
    `${user.firstName}${user.lastName}${user.email}`.toLowerCase().includes(searchValue.toLowerCase()),
  );
}

const TeamMembersBudget = ({
  teamId,
  control,
  refreshPeriod,
  memberBudgetsTotal,
  onMemberBudgetDefinition,
  existingBudget,
}: ITeamMembersBudgetProps): JSX.Element => {
  const dispatch = useDispatch();

  const teamUtilizations = useSelector(getTeamBudgetUtilization);
  const teamUtilizationTotalClaimed = useSelector(getTeamBudgetUtilizationTotal);

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

  const membersWithUtilization = useSelector(getMembersWithUtilization);

  const removedMembersHasUtilization = useMemo(() => {
    const currentTeamMemberIds = existingBudget?.teamMembers.map(user => user.userId);
    return !membersWithUtilization.every(userId => currentTeamMemberIds?.includes(userId));
  }, [existingBudget?.teamMembers, membersWithUtilization]);

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
            teamUtilizations={teamUtilizations}
            control={control}
            refreshPeriod={refreshPeriod}
            onMemberBudgetDefinition={onMemberBudgetDefinition}
            existingBudget={existingBudget}
          />
        </Box>
        <TeamMembersBudgetFooter
          refresh={refreshPeriod}
          totalMemberBudgets={memberBudgetsTotal}
          totalMembersUtilization={teamUtilizationTotalClaimed}
          removedMembersHasUtilization={removedMembersHasUtilization}
        />
      </Box>
    </Box>
  );
};

export default TeamMembersBudget;
