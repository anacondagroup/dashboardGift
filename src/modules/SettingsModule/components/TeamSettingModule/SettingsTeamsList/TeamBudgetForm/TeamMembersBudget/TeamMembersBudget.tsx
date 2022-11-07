import React, { useState, useEffect, useMemo } from 'react';
import { Box, Theme, Typography } from '@mui/material';
import { Tooltip, Icon, Divider, palette, SearchField } from '@alycecom/ui';
import { Control } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTeamMembersQuery } from '@alycecom/services';

import { TEAM_MEMBERS_TOOLTIP_MESSAGE } from '../../../../../constants/budget.constants';
import { RefreshPeriod, TBudgetCreateParams } from '../../../../../store/teams/budgetCreate/budgetCreate.types';
import { IBudget } from '../../../../../store/teams/budgets/budgets.types';
import { IUser } from '../../../../../../UsersManagement/store/usersManagement.types';
import { loadTeamBudgetUtilization } from '../../../../../../../store/budgetUtilization/budgetUtilization.actions';
import {
  getMembersWithUtilization,
  getTeamBudgetUtilization,
  getTeamBudgetUtilizationTotal,
} from '../../../../../../../store/budgetUtilization/budgetUtilization.selectors';

import TeamMembersTable from './TeamMembersBudgetTable';
import TeamMembersBudgetFooter from './TeamMembersBudgetFooter';

const styles = {
  headContainer: {
    display: 'flex',
    margin: ({ spacing }: Theme) => spacing(3.75, 0, 1.25, 0),
  },
  header: {
    fontSize: '20px',
    color: ({ palette: themePalette }: Theme) => themePalette.primary.main,
  },
  tableContainer: {
    border: ({ palette: themePalette }: Theme) => `1px solid ${themePalette.primary.superLight}`,
    borderRadius: 2,
  },
  tableScroll: {
    maxHeight: '35vh',
    overflow: 'scroll',
  },
  icon: {
    marginLeft: 0.5,
    color: palette.primary.superLight,
  },
  searchContainer: {
    width: '65%',
    margin: ({ spacing }: Theme) => spacing(1.25, 0),
  },
} as const;

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
            teamMembersHaveLoaded={teamMembersHaveLoaded && !isFetching}
            teamUtilizations={teamUtilizations}
            isAllSelected={false}
            handleSelectUser={() => false}
            handleSelectAllTeamMembers={() => null}
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
