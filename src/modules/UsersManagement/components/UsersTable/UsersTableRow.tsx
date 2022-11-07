import React, { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Checkbox, TableCell, TableRow, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionsMenu, AlyceTheme, Icon, IMenuItem, TableCellTooltip } from '@alycecom/ui';
import classNames from 'classnames';
import { User } from '@alycecom/modules';

import { IRowDataItem } from '../../../../components/Shared/CustomTable/CustomTable.types';
import { IUser, UserRoles } from '../../store/usersManagement.types';
import { formatAccess, formatIntegration, formatLastActivity, formatTeams } from '../../helpers/usersTableRow.helpers';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  text: {
    color: palette.primary.main,
    lineHeight: 20,
  },
  avatar: {
    marginRight: spacing(1),
  },
  actionButton: {
    display: 'none',
    position: 'absolute',
    right: 0,
    color: palette.link.main,
    marginRight: spacing(1),
  },
  visibleActionButton: {
    display: 'flex',
  },
  row: {
    cursor: 'pointer',
  },
  checked: {},
  checkbox: {
    color: palette.primary.main,
    '& + $checked': {
      color: palette.primary.main,
    },
  },
  menuInvisible: {
    display: 'none',
  },
}));

export interface IUsersTableRowProps<T extends IRowDataItem> {
  rowItem: T;
  isSelected: boolean;
  onOpenAssignToTeamModal: (data: T) => void;
  onOpenRemoveFromTeamModal: (data: T) => void;
  onMakeTeamAdmin: (data: T) => void;
  onMakeTeamMember: (data: T) => void;
  onEditUser: (data: T) => void;
  onSelectUser: (data: T, checked: boolean) => void;
}

const UsersTableRow = ({
  rowItem,
  isSelected,
  onOpenAssignToTeamModal,
  onOpenRemoveFromTeamModal,
  onMakeTeamAdmin,
  onMakeTeamMember,
  onEditUser,
  onSelectUser,
}: IUsersTableRowProps<IUser>): JSX.Element => {
  const classes = useStyles();

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const showActions = useCallback(() => {
    setIsMenuOpened(true);
  }, [setIsMenuOpened]);

  const hideActions = useCallback(() => {
    setIsMenuOpened(false);
  }, [setIsMenuOpened]);

  const handleSelectUser = useCallback(
    (_, checked: boolean) => {
      onSelectUser(rowItem, checked);
    },
    [onSelectUser, rowItem],
  );

  const formatUserTeams = useMemo(() => formatTeams(rowItem.teams), [rowItem]);
  const allTeamNames = useMemo(() => rowItem.teams.map(({ name }) => name).join(', '), [rowItem]);
  const formatUserAccess = useMemo(() => formatAccess(rowItem.teams), [rowItem]);
  const formatUserIntegration = useMemo(() => formatIntegration(rowItem.integration), [rowItem]);
  const formatUserActivity = useMemo(() => formatLastActivity(rowItem.lastActivity), [rowItem]);

  const handleEditUser = useCallback(() => {
    onEditUser(rowItem);
  }, [rowItem, onEditUser]);

  const currentUserId = useSelector(User.selectors.getUserId);
  const isItCurrentUser = rowItem.id === currentUserId;
  const isItAdmin = useMemo(() => rowItem.teams.find(team => team.access === UserRoles.admin) !== undefined, [rowItem]);
  const isItLastAdmin = rowItem.isLastAdmin;

  const menuItems = useMemo<IMenuItem<IUser>[]>(
    () => [
      {
        id: 'edit',
        text: 'Edit',
        action: onEditUser,
        dataTestid: `UsersManagement.Table.${rowItem.id}.Actions.Edit`,
      },
      ...(isItAdmin
        ? [
            {
              id: 'revoke_admin',
              text: 'Revoke Admin',
              action: onMakeTeamMember,
              ...(isItLastAdmin && {
                disabled: true,
                tooltip: 'You must have at least one admin',
              }),
              ...(isItCurrentUser && {
                disabled: true,
                tooltip: "You can't revoke yourself",
              }),
              dataTestid: `UsersManagement.Table.${rowItem.id}.Actions.RevokeAdmin`,
            },
          ]
        : [
            {
              id: 'make_admin',
              text: 'Make Admin',
              action: onMakeTeamAdmin,
              dataTestid: `UsersManagement.Table.${rowItem.id}.Actions.MakeAdmin`,
            },
          ]),
      {
        id: 'assign_team',
        text: 'Assign to team',
        action: onOpenAssignToTeamModal,
        dataTestid: `UsersManagement.Table.${rowItem.id}.Actions.AssignToTeam`,
      },
      {
        id: 'remove',
        text: 'Remove from account',
        action: onOpenRemoveFromTeamModal,
        ...(isItLastAdmin && {
          disabled: true,
          tooltip: "You can't remove last admin",
        }),
        ...(isItCurrentUser && {
          disabled: true,
          tooltip: "You can't remove yourself",
        }),
        dataTestid: `UsersManagement.Table.${rowItem.id}.Actions.Remove`,
      },
    ],
    [
      onOpenAssignToTeamModal,
      onOpenRemoveFromTeamModal,
      onMakeTeamAdmin,
      onMakeTeamMember,
      onEditUser,
      rowItem,
      isItAdmin,
      isItLastAdmin,
      isItCurrentUser,
    ],
  );

  return (
    <TableRow
      className={classes.row}
      onMouseEnter={showActions}
      onMouseLeave={hideActions}
      data-testid={`UsersManagement.Table.${rowItem.id}`}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onChange={handleSelectUser}
          data-testid={`UsersManagement.Table.${rowItem.id}.Checkbox`}
        />
      </TableCell>
      <TableCell>
        <Box
          position="relative"
          display="flex"
          minWidth={400}
          width={1}
          alignItems="center"
          justifyContent="flex-start"
          my={1}
        >
          <Avatar className={classes.avatar} src={rowItem.imageUrl} sizes="30" />
          <Box display="flex" flexDirection="column" alignItems="space-between" mr={1} onClick={handleEditUser}>
            <Typography className="Body-Regular-Left-Link" data-testid={`UsersManagement.Table.${rowItem.id}.Name`}>
              {rowItem.firstName} {rowItem.lastName}
            </Typography>
            <Typography className="Body-Small-Inactive">{rowItem.email}</Typography>
          </Box>
          {isMenuOpened && (
            <ActionsMenu<IUser>
              menuId={`menu-id-${rowItem.id}`}
              ActionButtonProps={{
                classes: { root: classNames(classes.actionButton, { [classes.visibleActionButton]: isMenuOpened }) },
                endIcon: <Icon icon="chevron-down" />,
                'data-testid': `UsersManagement.Table.${rowItem.id}.Actions`,
              }}
              menuItems={menuItems}
              menuData={rowItem}
            />
          )}
        </Box>
      </TableCell>
      <TableCell width={300}>
        <Typography className="Body-Regular-Left-Chambray" data-testid={`UsersManagement.Table.${rowItem.id}.Teams`}>
          {allTeamNames ? (
            <TableCellTooltip lengthToShow={10} title={allTeamNames} renderLabel={() => <>{formatUserTeams}</>} />
          ) : (
            formatUserTeams
          )}
        </Typography>
      </TableCell>
      <TableCell width={300}>
        <Typography className="Body-Regular-Left-Chambray" data-testid={`UsersManagement.Table.${rowItem.id}.Role`}>
          {formatUserAccess}
        </Typography>
      </TableCell>
      <TableCell width={200}>
        <Typography
          className="Body-Regular-Left-Chambray"
          data-testid={`UsersManagement.Table.${rowItem.id}.Integration`}
        >
          {formatUserIntegration}
        </Typography>
      </TableCell>
      <TableCell width={200}>
        <Typography
          className="Body-Regular-Left-Chambray"
          data-testid={`UsersManagement.Table.${rowItem.id}.LastActility`}
        >
          {formatUserActivity}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default memo(UsersTableRow);
