import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, Skeleton, Theme, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { LinkButton, Icon } from '@alycecom/ui';

import { loadUsersRequest, resetUsers, setIsAllSelected, setPaginationLimit } from '../../store/users/users.actions';
import {
  makeUserAsAdminRequest,
  makeUserAsMemberRequest,
  setAssignToTeamModalStatus,
  setRemoveFromTeamModalStatus,
  setResendInvitesToUsersModalStatus,
  toggleUsersSelections,
  setSingleSelectedUser,
  setUsersSidebarStep,
  toggleUserSelection,
  resendPendingInvitationMails,
} from '../../store/usersOperation/usersOperation.actions';
import {
  getIsAllSelected,
  getIsLoading,
  getPagination,
  getUsers,
  getUsersMeta,
} from '../../store/users/users.selectors';
import {
  getIsAssignToTeamModalOpen,
  getIsOperationPending,
  getIsRemoveFromTeamModalOpen,
  getIsResendInvitesToUsersModalOpen,
  getIsSelectAllSectionVisible,
  getSelectedUsers,
} from '../../store/usersOperation/usersOperation.selectors';
import { ICustomTableColumn } from '../../../../components/Shared/CustomTable/CustomTable.types';
import { IUser } from '../../store/usersManagement.types';
import CustomTable from '../../../../components/Shared/CustomTable/CustomTable';
import useCustomTable from '../../../../components/Shared/CustomTable/useCustomTable';
import UserAssignToTeamModal from '../UserAssignToTeamModal/UserAssignToTeamModal';
import { loadTeamsRequest } from '../../store/entities/teams/teams.actions';
import { getIsUserSelected } from '../../store/usersManagement.helpers';
import RemoveUserFromTeamModal from '../RemoveUserFromTeamModal/RemoveUserFromTeamModal';
import ResendInvitesToUsersModal from '../ResendInvitesToUsersModal/ResendInvitesToUsersModal';
import UsersSidebar from '../UsersSidebar/UsersSidebar';
import {
  useTrackUsersManagementPageVisited,
  useTrackUsersManagementPendingInvitationsNotificationVisible,
} from '../../hooks/useTrackUsersManagement';
import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import { TABLE_SORT } from '../../../../components/Shared/CustomTable/customTable.constants';
import { getPageSelectedUsersCount } from '../../store/usersManagement.selectors';

import EmptyUsersPlaceholder from './EmptyUsersPlaceholder';
import UsersTableRow from './UsersTableRow';
import EmptyRowPlaceholder from './EmptyRowPlaceholder';
import UsersTableToolbar from './UsersTableToolbar';
import UsersTableHead from './UsersTableHead';
import UsersTableFooter from './UsersTableFooter';

const columns: ICustomTableColumn<IUser>[] = [
  {
    name: 'Name',
    field: 'name',
  },
  {
    name: 'Teams',
    field: 'teams',
  },
  {
    name: 'Access',
    field: 'role',
  },
  {
    name: 'Integrations',
    field: 'integration',
  },
  {
    name: 'Last Activity',
    field: 'lastActivity',
  },
];

const styles = {
  warning: {
    backgroundColor: ({ palette }: Theme) => palette.yellow.sunflowerSuperLight,
    color: ({ palette }: Theme) => palette.text.primary,
    borderRadius: ({ spacing }: Theme) => spacing(1),
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  warningIcon: {
    color: ({ palette }: Theme) => palette.yellow.sunflower,
    marginRight: ({ spacing }: Theme) => spacing(1),
  },
  sendLink: {
    marginLeft: ({ spacing }: Theme) => spacing(3),
  },
  closeButton: {
    color: ({ palette }: Theme) => palette.common.white,
    '& svg': {
      width: '26px !important',
      height: '26px !important',
    },
    marginLeft: ({ spacing }: Theme) => spacing(2),
  },
} as const;

const UsersTable = (): JSX.Element => {
  const dispatch = useDispatch();

  const { search, sortField = 'name', sortDirection = TABLE_SORT.ASC, setValues, currentPage } = useCustomTable();
  const users = useSelector(getUsers);
  const usersMeta = useSelector(getUsersMeta);
  const isLoading = useSelector(getIsLoading);
  const isOperationPending = useSelector(getIsOperationPending);
  const pagination = useSelector(getPagination);
  const isAssignToTeamModalOpen = useSelector(getIsAssignToTeamModalOpen);
  const isRemoveFromTeamModalOpen = useSelector(getIsRemoveFromTeamModalOpen);
  const isResendInvitesToUsersModalOpen = useSelector(getIsResendInvitesToUsersModalOpen);
  const selectedUsers = useSelector(getSelectedUsers);
  const isAllSelected = useSelector(getIsAllSelected);
  const isSelectAllSectionVisible = useSelector(getIsSelectAllSectionVisible);
  const pageSelectedUsersCount = useSelector(getPageSelectedUsersCount);

  const [teamId, setTeamId] = useState<number | null>(null);
  const [pendingInvitation, setPendingInvitation] = useState<boolean>(false);
  const onTeamChange = useCallback((id: number | null) => setTeamId(id), []);
  const onPendingInvitationChange = useCallback((value: boolean) => setPendingInvitation(value), []);
  const [notificationVisible, setNotificationVisible] = useState<boolean>(true);

  const showPendingInvitationsNotification = notificationVisible && usersMeta.pendingInvitationUsers.length > 0;
  const numberOfPendingInvitations = usersMeta.pendingInvitationUsers.length;

  const { limit } = pagination;

  const rowsPerPageOptions = [10, 25, 50, 100];

  const usersRequestPayload = useMemo(
    () => ({
      search,
      sortField,
      sortDirection,
      currentPage,
      limit,
      teamId,
      pendingInvitation,
    }),
    [search, sortField, sortDirection, currentPage, teamId, limit, pendingInvitation],
  );

  const handleOpenAssignTeamModal = useCallback(
    (user: IUser) => {
      dispatch(setSingleSelectedUser(user));
      dispatch(setAssignToTeamModalStatus(true));
    },
    [dispatch],
  );

  const handleCloseAssignTeamModal = useCallback(() => {
    dispatch(setSingleSelectedUser(null));
    dispatch(setAssignToTeamModalStatus(false));
  }, [dispatch]);

  const handleOpenRemoveFromTeamModal = useCallback(
    (user: IUser) => {
      dispatch(setSingleSelectedUser(user));
      dispatch(setRemoveFromTeamModalStatus(true));
    },
    [dispatch],
  );

  const handleCloseRemoveFromTeamModal = useCallback(() => {
    dispatch(setSingleSelectedUser(null));
    dispatch(setRemoveFromTeamModalStatus(false));
  }, [dispatch]);

  const handleMakeTeamAdmin = useCallback(
    (user: IUser) => {
      dispatch(makeUserAsAdminRequest(user.id));
    },
    [dispatch],
  );

  const handleMakeTeamMember = useCallback(
    (user: IUser) => {
      dispatch(makeUserAsMemberRequest({ userId: user.id }));
    },
    [dispatch],
  );

  const handleSelectUser = useCallback(
    (user: IUser, checked: boolean) => {
      dispatch(toggleUserSelection({ user, checked }));
    },
    [dispatch],
  );

  const handleCloseResendInvitesToUsersModal = useCallback(() => {
    dispatch(setResendInvitesToUsersModalStatus(false));
  }, [dispatch]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      dispatch(toggleUsersSelections({ users, checked }));
    },
    [dispatch, users],
  );

  const handleToggleSelectAllItems = useCallback(
    (isSelected: boolean) => {
      dispatch(setIsAllSelected(isSelected));
    },
    [dispatch],
  );

  const handleEditUser = useCallback(
    (user: IUser) => {
      dispatch(setSingleSelectedUser(user));
      dispatch(setUsersSidebarStep(UsersSidebarStep.editUser));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(loadUsersRequest(usersRequestPayload));
  }, [dispatch, usersRequestPayload]);

  useEffect(
    () => () => {
      dispatch(resetUsers());
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(loadTeamsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isAllSelected) {
      handleSelectAll(true);
    }
  }, [handleSelectAll, isAllSelected]);

  useTrackUsersManagementPageVisited();
  useTrackUsersManagementPendingInvitationsNotificationVisible();

  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(setPaginationLimit(parseInt(event.target.value, 10)));
    },
    [dispatch],
  );

  const handleResendInviteMail = useCallback(() => {
    dispatch(resendPendingInvitationMails({ userIds: usersMeta.pendingInvitationUsers }));
  }, [dispatch, usersMeta]);

  const onCloseNotification = useCallback(() => {
    setNotificationVisible(false);
  }, [setNotificationVisible]);

  return (
    <Box p={3}>
      {showPendingInvitationsNotification && (
        <Box p={1} mb={3} sx={styles.warning}>
          <Box display="flex">
            <Typography display="flex">
              <ErrorIcon sx={styles.warningIcon} /> {numberOfPendingInvitations} users haven&apos;t setup their account
              yet.
            </Typography>
            {isOperationPending ? (
              <Box ml={3}>
                <Skeleton variant="text" width={130} />
              </Box>
            ) : (
              <Box sx={styles.sendLink}>
                <LinkButton
                  onClick={handleResendInviteMail}
                  data-testid="UsersManagement.PendingUsersNotification.ResendInviteMail"
                >
                  Resend Invite Mail
                </LinkButton>
              </Box>
            )}
          </Box>
          <IconButton
            sx={styles.closeButton}
            onClick={onCloseNotification}
            data-testid="UsersManagement.PendingUsersNotification.Close"
          >
            <Icon icon={['far', 'times']} />
          </IconButton>
        </Box>
      )}
      <CustomTable
        isLoading={isLoading}
        placeholder="Search users"
        columns={columns}
        rowData={users}
        search={search}
        sortField={sortField}
        sortDirection={sortDirection}
        setValues={setValues}
        currentPage={currentPage}
        limit={pagination.limit}
        total={pagination.total}
        renderRow={({ rowDataItem }) => (
          <UsersTableRow
            key={rowDataItem.id}
            rowItem={rowDataItem}
            isSelected={getIsUserSelected(selectedUsers, rowDataItem)}
            onOpenAssignToTeamModal={handleOpenAssignTeamModal}
            onOpenRemoveFromTeamModal={handleOpenRemoveFromTeamModal}
            onMakeTeamAdmin={handleMakeTeamAdmin}
            onMakeTeamMember={handleMakeTeamMember}
            onEditUser={handleEditUser}
            onSelectUser={handleSelectUser}
          />
        )}
        NoDataComponent={EmptyUsersPlaceholder}
        ToolbarComponent={UsersTableToolbar}
        ToolbarComponentProps={{
          placeholder: 'Search users',
          isLoading,
          teamId,
          pendingInvitation,
          onTeamChange,
          onPendingInvitationChange,
        }}
        EmptyRowComponent={EmptyRowPlaceholder}
        TableHeadComponent={UsersTableHead}
        TableHeadComponentProps={{
          multiselect: true,
          selectedCount: selectedUsers.length,
          selectedTotal: users.length,
          pageSelectedCount: pageSelectedUsersCount,
          onSelectAll: handleSelectAll,
          pagination,
          isAllSelected,
          isSelectAllSectionVisible,
          onToggleSelection: handleToggleSelectAllItems,
        }}
        TableFooterComponent={UsersTableFooter}
        TableFooterComponentProps={{ rowsPerPageOptions, onRowsPerPageChange }}
      />
      <UserAssignToTeamModal isOpen={isAssignToTeamModalOpen} onDiscard={handleCloseAssignTeamModal} />
      <RemoveUserFromTeamModal isOpen={isRemoveFromTeamModalOpen} onDiscard={handleCloseRemoveFromTeamModal} />
      <ResendInvitesToUsersModal
        isOpen={isResendInvitesToUsersModalOpen}
        onDiscard={handleCloseResendInvitesToUsersModal}
      />
      <UsersSidebar />
    </Box>
  );
};

export default memo(UsersTable);
