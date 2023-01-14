import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { ActionsMenu, Icon, LinkButton, TableLoadingLabel, Divider } from '@alycecom/ui';
import { Typography, TableCell, Box, TableRow } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment/moment';
import { useDispatch, useSelector, batch } from 'react-redux';
import { Features, SHORT_DATE_FORMAT } from '@alycecom/modules';
import { MessageType, showGlobalMessage, useUnarchiveTeamByIdMutation } from '@alycecom/services';

import { ITeam, TeamStatus } from '../../../../../store/teams/teams/teams.types';
import { BudgetCell } from '../Cells';
import { setTeamSidebarStep } from '../../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../../store/teams/teamOperation/teamOperation.types';
import { getIsLoading } from '../../../../../store/teams/teams/teams.selectors';
import { setArchiveTeamModalOpenStatus, setSelectedTeamId } from '../../../../../store/ui/teamsManagement';
import { loadTeamsSettingsRequest } from '../../../../../store/teams/teams/teams.actions';
import AdminUser from '../AdminUser';

import { styles, useStyles } from './TeamRow.styles';

export interface ITeamRowProps {
  team: Partial<ITeam> & Pick<ITeam, 'id'>;
  onSelect: (id: number) => void;
}

const TeamRow = ({ team, onSelect }: ITeamRowProps): JSX.Element => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [unarchiveTeamById, { isSuccess }] = useUnarchiveTeamByIdMutation();

  const hasArchiveTeamsActions = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ARCHIVE_TEAMS));
  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const isLoading = useSelector(getIsLoading);

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleOpenArchiveTeamsModal = useCallback(
    ({ id }: ITeam) => {
      dispatch(setArchiveTeamModalOpenStatus(true));
      dispatch(setSelectedTeamId(id));
    },
    [dispatch],
  );

  const handleUnarchiveTeam = useCallback(
    ({ id }: ITeam) => {
      unarchiveTeamById(id);
    },
    [unarchiveTeamById],
  );

  const showActions = useCallback(() => {
    setIsMenuOpened(true);
  }, [setIsMenuOpened]);

  const hideActions = useCallback(() => {
    setIsMenuOpened(false);
  }, [setIsMenuOpened]);

  const handleEditTeam = () => {
    if (!team.group) {
      dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo, team: team as ITeam, teamId: team.id }));
    }
  };

  const handleSelectTeam = () => {
    if (team) {
      onSelect(team.id);
    }
  };

  const firstTwoAdmins = useMemo(() => (team?.admins || []).slice(0, 2), [team]);

  const isTeamArchived = team?.status === TeamStatus.archived;
  const isTeamActive = team?.status === TeamStatus.active;

  const isArchivedAtVisible = hasArchiveTeamsActions && isTeamArchived && team?.archivedAt;
  const archivedText = isArchivedAtVisible ? `Archived ${moment(team?.archivedAt).format(SHORT_DATE_FORMAT)}` : '';

  const menuItems = useMemo(
    () => [
      {
        id: 'archive',
        text: 'Archive team',
        action: handleOpenArchiveTeamsModal,
        hidden: false,
        dataTestId: 'TeamsManagement.Actions.Archive',
        disabled: isTeamArchived,
      },
      {
        id: 'unarchive',
        text: 'Unarchive team',
        action: handleUnarchiveTeam,
        hidden: false,
        dataTestId: 'TeamsManagement.Actions.Unarchive',
        disabled: isTeamActive,
      },
    ],
    [handleOpenArchiveTeamsModal, handleUnarchiveTeam, isTeamArchived, isTeamActive],
  );

  useEffect(() => {
    if (isSuccess) {
      batch(() => {
        dispatch(
          showGlobalMessage({
            type: MessageType.Success,
            text: 'Team has been unarchived',
          }),
        );
        dispatch(loadTeamsSettingsRequest({}));
      });
    }
  }, [dispatch, isSuccess]);

  return (
    <TableRow onMouseEnter={showActions} onMouseLeave={hideActions} data-testid="TeamListTable.Row">
      <TableCell>
        <TableLoadingLabel
          isLoading={isLoading}
          render={() => (
            <Box sx={styles.teamNameWrapper}>
              <Typography
                sx={styles.teamNameLink}
                onClick={handleSelectTeam}
                data-testid={`TeamManagement.Table.${team.id}.Settings`}
              >
                {team.name}
              </Typography>
              <Box sx={styles.teamInfoWrapper}>
                {isArchivedAtVisible && (
                  <>
                    <Typography sx={styles.archivedDate}>{archivedText}</Typography>
                    <Divider mx={1} height={16} orientation="vertical" />
                  </>
                )}
                <LinkButton
                  className={classNames(classes.editLink, {
                    [classes.blockedLink]: !!team?.group,
                  })}
                  onClick={handleEditTeam}
                >
                  {team?.group ? `Billing group: ${team?.group.name}` : 'Define billing group'}
                </LinkButton>
              </Box>
              {hasArchiveTeamsActions && isMenuOpened && (
                <ActionsMenu<ITeam>
                  menuId={`menu-id-${team.id}`}
                  ActionButtonProps={{
                    classes: {
                      root: classNames(classes.actionButton, {
                        [classes.visibleActionButton]: isMenuOpened,
                      }),
                    },
                    endIcon: <Icon icon="chevron-down" />,
                    'data-testid': `TeamsManagement.Table.${team.id}.Actions`,
                  }}
                  menuItems={menuItems}
                  menuData={team as ITeam}
                />
              )}
            </Box>
          )}
        />
      </TableCell>
      <TableCell>
        <TableLoadingLabel
          isLoading={isLoading}
          render={() => <Typography sx={styles.membersCount}>{team?.members?.amount}</Typography>}
        />
      </TableCell>
      <TableCell>
        <TableLoadingLabel
          isLoading={isLoading}
          render={() => (
            <Box display="flex" flexDirection="row" alignItems="center">
              {firstTwoAdmins.map(admin => (
                <AdminUser key={admin.email} email={admin.email} fullName={admin.full_name} avatar={admin.avatar} />
              ))}
            </Box>
          )}
        />
      </TableCell>
      {hasBudgetManagementSetup && <BudgetCell teamId={team.id} />}
    </TableRow>
  );
};

export default memo(TeamRow);
