import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  SearchField,
  Icon,
  AlyceTheme,
  ActionButton,
  SelectFilter,
  ALL_ITEMS,
  isAllItems,
  ActionsMenu,
  IMenuItem,
} from '@alycecom/ui';
import { Box, Grid, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDebounce } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';

import { TCustomTableSetValues } from '../../../../components/Shared/CustomTable/useCustomTable';
import {
  setAssignToTeamModalStatus,
  setUsersSidebarStep,
  setRemoveFromTeamModalStatus,
  setResendInvitesToUsersModalStatus,
  exportSelectedUsersRequest,
} from '../../store/usersOperation/usersOperation.actions';
import {
  getCurrentActionUsers,
  getIsCurrentUserSelected,
  getIsLastAdminSelected,
} from '../../store/usersManagement.selectors';
import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import { getTeams } from '../../store/entities/teams';
import { getUsersMeta } from '../../store/users/users.selectors';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  actionButton: {
    minWidth: 130,
    color: palette.link.main,
    marginLeft: spacing(1),
    marginRight: spacing(1),
  },
  selector: {
    width: 180,
    minWidth: 180,
    marginLeft: spacing(1),
  },
}));

interface IUsersTableToolbarProps {
  search: string;
  setValues: TCustomTableSetValues;
  isLoading: boolean;
  teamId: number;
  pendingInvitation: boolean;
  onTeamChange: (teamId: number | null) => void;
  onPendingInvitationChange: (value: boolean) => void;
  debounce?: number;
}

const UsersTableToolbar = ({
  search,
  teamId,
  pendingInvitation,
  onTeamChange,
  onPendingInvitationChange,
  setValues,
  isLoading,
  debounce = 500,
}: IUsersTableToolbarProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedUsers = useSelector(getCurrentActionUsers);
  const teams = useSelector(getTeams);
  const usersMeta = useSelector(getUsersMeta);

  const isCurrentUserSelected = useSelector(getIsCurrentUserSelected);
  const isLastAdminSelected = useSelector(getIsLastAdminSelected);

  const isPendingInvitationFilterVisible = usersMeta.pendingInvitationUsers.length > 0;
  const isTeamsFilterVisible = teams.length > 1;
  const teamsOptions = useMemo(() => [{ id: ALL_ITEMS, name: 'All teams' }, ...teams], [teams]);

  const [searchValue, setSearchValue] = useState(search);
  const isBulkActionsDisabled = selectedUsers.length === 0 || isLoading;

  const isResendInviteDisabled = useMemo<boolean>(() => {
    const inactiveUsers = selectedUsers.filter(user => user.lastActivity === null);
    return inactiveUsers.length === 0;
  }, [selectedUsers]);

  const handleTeamChange = useCallback(
    (newTeamId: number | null) => {
      onTeamChange(newTeamId);
      setValues({ currentPage: 1 });
    },
    [setValues, onTeamChange],
  );

  const handlePendingInvitationChange = useCallback(
    (value: string) => {
      onPendingInvitationChange(value === 'pending');
      setValues({ currentPage: 1 });
    },
    [setValues, onPendingInvitationChange],
  );

  useDebounce(
    () => {
      setValues({
        search: searchValue,
        currentPage: 1,
      });
    },
    debounce,
    [searchValue, setValues],
  );

  const handleCreateUsers = useCallback(() => {
    dispatch(setUsersSidebarStep(UsersSidebarStep.userInfo));
  }, [dispatch]);

  const handleAssignToTeams = useCallback(() => {
    dispatch(setAssignToTeamModalStatus(true));
  }, [dispatch]);

  const handleRemoveFromTeams = useCallback(() => {
    dispatch(setRemoveFromTeamModalStatus(true));
  }, [dispatch]);

  const handleResendInvites = useCallback(() => {
    dispatch(setResendInvitesToUsersModalStatus(true));
  }, [dispatch]);

  const handleExportSelectedUsers = useCallback(() => {
    dispatch(exportSelectedUsersRequest());
  }, [dispatch]);

  const menuItems = useMemo<IMenuItem<object>[]>(
    () => [
      {
        id: 'resend_invite',
        text: 'Resend invite email',
        action: handleResendInvites,
        disabled: isResendInviteDisabled,
        dataTestid: 'UsersManagement.Actions.ResendInvite',
      },
      {
        id: 'assign_team',
        text: 'Assign to team',
        action: handleAssignToTeams,
        dataTestid: 'UsersManagement.Actions.AssignToTeam',
      },
      {
        id: 'export',
        text: 'Export selected users',
        action: handleExportSelectedUsers,
        dataTestid: 'UsersManagement.Actions.ExportUsers',
      },
      {
        id: 'remove',
        text: 'Remove from account',
        action: handleRemoveFromTeams,
        ...(isLastAdminSelected && {
          disabled: true,
          tooltip: "You can't remove last admin",
        }),
        ...(isCurrentUserSelected && {
          disabled: true,
          tooltip: "You can't remove yourself",
        }),
        dataTestid: 'UsersManagement.Actions.Remove',
      },
    ],
    [
      handleExportSelectedUsers,
      isResendInviteDisabled,
      handleResendInvites,
      handleAssignToTeams,
      handleRemoveFromTeams,
      isCurrentUserSelected,
      isLastAdminSelected,
    ],
  );

  return (
    <Box mb={3}>
      <Grid container direction="row" wrap="nowrap">
        <SearchField
          placeholder="Search users"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
          dataTestId="UsersManagement.SearchInput"
        />
        {isTeamsFilterVisible && (
          <SelectFilter
            name="team"
            label="All teams"
            value={teamId || ALL_ITEMS}
            disabled={isLoading}
            onFilterChange={({ team }) => handleTeamChange(isAllItems(team) ? null : team)}
            classes={{ root: classes.selector }}
            dataTestId="UsersManagement.TeamSelect"
          >
            {teamsOptions.map(item => (
              <MenuItem key={item.id} value={item.id} data-testid={`UsersManagement.TeamSelect.${item.id}`}>
                {item.name}
              </MenuItem>
            ))}
          </SelectFilter>
        )}
        {isPendingInvitationFilterVisible && (
          <SelectFilter
            name="pendingInvitation"
            label="Status"
            value={pendingInvitation ? 'pending' : 'all'}
            disabled={isLoading}
            onFilterChange={({ pendingInvitation: pending }) => handlePendingInvitationChange(pending)}
            classes={{ root: classes.selector }}
            dataTestId="UsersManagement.PendingInvitation"
          >
            <MenuItem key="pending-all" value="all" data-testid="UsersManagement.PendingInvitation.All">
              All
            </MenuItem>
            <MenuItem key="pending-pending" value="pending" data-testid="UsersManagement.PendingInvitation.Pending">
              Pending
            </MenuItem>
          </SelectFilter>
        )}
        <ActionsMenu
          menuId="bulk-menu-id"
          ActionButtonProps={{
            classes: { root: classes.actionButton },
            endIcon: <Icon icon="chevron-down" />,
            disabled: isBulkActionsDisabled,
            'data-testid': `UsersManagement.Actions`,
          }}
          menuItems={menuItems}
          menuData={{}}
        />
        <Box minWidth={140}>
          <ActionButton
            width="100%"
            disabled={isLoading}
            onClick={handleCreateUsers}
            data-testid="UsersManagement.CreateUsers"
          >
            Create users
          </ActionButton>
        </Box>
      </Grid>
    </Box>
  );
};

export default memo(UsersTableToolbar);
