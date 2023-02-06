import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { ActionsMenu, Icon, LinkButton, TableLoadingLabel, Divider, Tooltip } from '@alycecom/ui';
import { Typography, TableCell, Box, TableRow } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment/moment';
import { useDispatch, useSelector, batch } from 'react-redux';
import { Features, SHORT_DATE_FORMAT } from '@alycecom/modules';
import { MessageType, showGlobalMessage, useUnarchiveTeamByIdMutation } from '@alycecom/services';
import { useRouting } from '@alycecom/hooks';

import { ITeam, TeamStatus } from '../../../../../store/teams/teams/teams.types';
import { BudgetCell } from '../Cells';
import { setTeamSidebarStep } from '../../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../../store/teams/teamOperation/teamOperation.types';
import { getIsLoading } from '../../../../../store/teams/teams/teams.selectors';
import { setArchiveTeamModalOpenStatus, setSelectedTeamId } from '../../../../../store/ui/teamsManagement';
import { loadTeamsSettingsRequest } from '../../../../../store/teams/teams/teams.actions';
import AdminUser from '../AdminUser';
import { loadBrandingRequest } from '../../../../../store/teams/branding/branding.actions';

import { styles, useStyles } from './TeamRow.styles';

export interface ITeamRowProps {
  team: Partial<ITeam> & Pick<ITeam, 'id'>;
  onSelect: (id: number) => void;
  disabled?: boolean;
}

const TeamRow = ({ team, onSelect, disabled = false }: ITeamRowProps): JSX.Element => {
  const classes = useStyles();
  const go = useRouting();
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

  const handleSettingsTeam = useCallback(
    ({ id }: ITeam) => {
      go(`/settings/teams/${id}/settings-and-permissions/general`);
    },
    [go],
  );

  const handleTemplatesTeam = useCallback(
    ({ id }: ITeam) => {
      go(`/settings/teams/${id}/settings-and-permissions/templates`);
    },
    [go],
  );

  const handleEmailBrandingTeam = useCallback(
    ({ id }: ITeam) => {
      go(`/branding/teams/${id}`);
    },
    [go],
  );

  const handleBudgetTeam = useCallback(
    ({ id }: ITeam) => {
      dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamBudget, teamId: id }));
    },
    [dispatch],
  );
  const handleLPBrandingTeam = useCallback(
    ({ id }: ITeam) => {
      dispatch(loadBrandingRequest({ teamId: id, showBranding: true }));
    },
    [dispatch],
  );

  const showActions = useCallback(() => {
    setIsMenuOpened(true);
  }, [setIsMenuOpened]);

  const hideActions = useCallback(() => {
    setIsMenuOpened(false);
  }, [setIsMenuOpened]);

  const handleEditTeam = () => {
    if (!team.group && !disabled) {
      dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo, team: team as ITeam, teamId: team.id }));
    }
  };

  const handleSelectTeam = () => {
    if (team && !disabled) {
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
        id: 'settings',
        text: 'Settings',
        action: handleSettingsTeam,
        dataTestId: 'TeamsManagement.Actions.Settings',
        disabled: isTeamArchived,
      },
      {
        id: 'budget',
        text: 'Budget',
        action: handleBudgetTeam,
        hidden: !hasBudgetManagementSetup,
        dataTestId: 'TeamsManagement.Actions.Budget',
        disabled: isTeamArchived || !hasBudgetManagementSetup,
      },
      {
        id: 'email-branding',
        text: 'Email branding',
        action: handleEmailBrandingTeam,
        dataTestId: 'TeamsManagement.Actions.EmailBranding',
        disabled: isTeamArchived,
      },
      {
        id: 'lpbranding',
        text: 'Landing page branding',
        action: handleLPBrandingTeam,
        dataTestId: 'TeamsManagement.Actions.LPBranding',
        disabled: isTeamArchived,
      },
      {
        id: 'templates',
        text: 'Templates',
        action: handleTemplatesTeam,
        dataTestId: 'TeamsManagement.Actions.Templates',
        disabled: isTeamArchived,
      },
      {
        id: 'archive',
        text: 'Archive team',
        action: handleOpenArchiveTeamsModal,
        hidden: isTeamArchived || !hasArchiveTeamsActions,
        dataTestId: 'TeamsManagement.Actions.Archive',
        disabled: isTeamArchived,
      },
      {
        id: 'unarchive',
        text: 'Unarchive team',
        action: handleUnarchiveTeam,
        hidden: isTeamActive || !hasArchiveTeamsActions,
        dataTestId: 'TeamsManagement.Actions.Unarchive',
        disabled: isTeamActive,
      },
    ],
    [
      handleOpenArchiveTeamsModal,
      handleUnarchiveTeam,
      isTeamArchived,
      isTeamActive,
      handleSettingsTeam,
      handleTemplatesTeam,
      handleEmailBrandingTeam,
      hasBudgetManagementSetup,
      handleBudgetTeam,
      handleLPBrandingTeam,
      hasArchiveTeamsActions,
    ],
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
            <Tooltip
              title={
                disabled
                  ? 'You don’t have permission to edit this team. Only team admins who have been specifically assigned to this team have the ability to make changes to its settings.'
                  : ''
              }
            >
              <Box sx={styles.teamNameWrapper}>
                <Typography
                  sx={{ ...styles.teamNameLink, ...(disabled && styles.disabled) }}
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
                    disabled={disabled}
                    className={classNames(classes.editLink, {
                      [classes.blockedLink]: !!team?.group,
                    })}
                    onClick={handleEditTeam}
                  >
                    {team?.group ? `Billing group: ${team?.group.name}` : 'Define billing group'}
                  </LinkButton>
                </Box>
                {isMenuOpened && !disabled && (
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
            </Tooltip>
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
      {hasBudgetManagementSetup && <BudgetCell disabled={disabled} teamId={team.id} />}
    </TableRow>
  );
};

export default memo(TeamRow);
