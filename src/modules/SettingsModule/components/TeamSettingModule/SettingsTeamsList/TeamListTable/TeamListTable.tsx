import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import * as R from 'ramda';
import classnames from 'classnames';
import { AlyceTheme, LinkButton, SearchField, TableLoadingLabel } from '@alycecom/ui';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import { usePagination } from '../../../../../../hooks/usePagination';
import EmptyDataset from '../../../../../../components/Shared/EmptyDataset';
import {
  getErrors,
  getIsLoaded,
  getIsLoading,
  getTeamIds,
  getTeams,
} from '../../../../store/teams/teams/teams.selectors';
import { ITeam } from '../../../../store/teams/teams/teams.types';
import { clearTeamsSetting, loadTeamsSettingsRequest } from '../../../../store/teams/teams/teams.actions';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import TeamSidebar from '../TeamSidebar/TeamSidebar';
import { getIsBudgetLoading } from '../../../../store/teams/budgets/budgets.selectors';
import { loadBudgets } from '../../../../store/teams/budgets/budgets.actions';

import BudgetCell from './BudgetCell';

export enum TABLE_SORT {
  ASC = 'asc',
  DESC = 'desc',
}

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  tableLink: {
    cursor: 'pointer',
    display: 'inline-block',
  },
  adminName: {
    fontSize: 16,
    lineHeight: 1.25,
  },
  adminEmail: {
    fontSize: 12,
    color: palette.grey.main,
  },
  adminsCell: {
    minWidth: 400,
  },
  createButton: {
    width: 150,
    height: 48,
    color: palette.common.white,
    backgroundColor: palette.green.dark,
    '&:hover': {
      color: palette.common.white,
      backgroundColor: palette.green.mountainMeadowLight,
    },
  },
  editLink: {
    fontSize: 12,
    fontWeight: 400,
  },
  blockedLink: {
    cursor: 'default',
    color: palette.grey.main,
  },
}));

const pagination = {
  per_page: 10,
};

export interface ITeamListTableProps {
  onSelect: (id: number) => void;
}

const TeamListTable = ({ onSelect }: ITeamListTableProps): JSX.Element => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const teams = useSelector(getTeams);
  const teamIds = useSelector(getTeamIds);

  const isLoaded = useSelector(getIsLoaded);
  const isLoading = useSelector(getIsLoading);

  const isBudgetsLoading = useSelector(getIsBudgetLoading);
  const errors = useSelector(getErrors);

  const isCreateTeamFeatureEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.CREATE_A_TEAM));
  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<TABLE_SORT>(TABLE_SORT.ASC);
  const [search, onSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = useCallback(
    column => {
      setSortColumn(column);
      setSortDirection(sortDirection === TABLE_SORT.ASC ? TABLE_SORT.DESC : TABLE_SORT.ASC);
    },
    [sortDirection],
  );

  const showTable = useMemo(() => !(isLoaded && teams.length === 0), [isLoaded, teams]);

  const handledItems = useMemo<ITeam[]>(() => {
    const direction = sortDirection === TABLE_SORT.ASC ? R.ascend : R.descend;
    const sortByColumn: (teams: ITeam[]) => ITeam[] = R.sort(direction(R.path(sortColumn.split('.'))));
    const searchByName = ({ name }: ITeam) => R.includes(R.toLower(search), R.toLower(name));
    const filterFn: (teams: ITeam[]) => ITeam[] = search ? R.filter(searchByName) : R.identity;
    return R.pipe(filterFn, sortByColumn)(teams);
  }, [search, sortColumn, sortDirection, teams]);

  const [itemsToShow, showPagination] = usePagination<ITeam>(
    currentPage - 1,
    pagination.per_page,
    handledItems,
    isLoading,
  );

  const handleCreateTeam = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo }));
  }, [dispatch]);

  const handleClickBudget = useCallback(
    (teamId: number) => {
      dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamBudget, teamId }));
    },
    [dispatch],
  );

  const handleEditTeam = (team: ITeam) => {
    if (!team.group) {
      dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo, team, teamId: team.id }));
    }
  };

  useEffect(() => {
    dispatch(loadTeamsSettingsRequest());
    return () => {
      dispatch(clearTeamsSetting());
    };
  }, [dispatch]);

  useEffect(() => {
    if (hasBudgetManagementSetup) {
      dispatch(loadBudgets({ teamIds }));
    }
  }, [dispatch, hasBudgetManagementSetup, teamIds]);

  return (
    <Box p={3} style={{ overflowX: 'auto' }}>
      <Box mb={3}>
        <Grid container direction="row" wrap="nowrap">
          <SearchField
            placeholder="Search teams"
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
          />
          {isCreateTeamFeatureEnabled && (
            <Box minWidth={140} ml={2}>
              <Button
                className={classes.createButton}
                variant="contained"
                disabled={isLoading}
                onClick={handleCreateTeam}
                data-testid="TeamManagement.CreateTeam"
              >
                Create a team
              </Button>
            </Box>
          )}
        </Grid>
      </Box>
      {(!showTable || errors) && (
        <Box pt={8} pb={8}>
          <EmptyDataset dataSetName="teams" />
        </Box>
      )}
      {showTable && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  direction={sortDirection}
                  active={sortColumn === 'name'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  direction={sortDirection}
                  active={sortColumn === 'members.amount'}
                  onClick={() => handleSort('members.amount')}
                >
                  Members
                </TableSortLabel>
              </TableCell>
              <TableCell>Admin(s)</TableCell>
              {hasBudgetManagementSetup && <TableCell>Budget Assigned</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsToShow.map(team => (
              <TableRow key={team.id}>
                <TableCell>
                  <TableLoadingLabel
                    isLoading={isLoading}
                    maxWidth={400}
                    pr={2}
                    render={() => (
                      <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
                        <Typography
                          className={classnames('Body-Regular-Left-ALL-CAP-LINK-Bold', classes.tableLink)}
                          onClick={() => onSelect(team.id)}
                          data-testid={`TeamManagement.Table.${team.id}.Settings`}
                        >
                          {team.name}
                        </Typography>
                        <LinkButton
                          className={classnames(classes.editLink, {
                            [classes.blockedLink]: !!team?.group,
                          })}
                          onClick={() => handleEditTeam(team)}
                        >
                          {team?.group ? `Billing group: ${team?.group.name}` : 'Define billing group'}
                        </LinkButton>
                      </Box>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TableLoadingLabel
                    maxWidth={190}
                    pr={2}
                    isLoading={isLoading}
                    render={() => team.members && team.members.amount}
                  />
                </TableCell>
                <TableCell className={classes.adminsCell}>
                  <TableLoadingLabel
                    isLoading={isLoading}
                    maxWidth={400}
                    pr={2}
                    render={() => (
                      <Box display="flex" flexDirection="row">
                        {team.admins &&
                          team.admins.slice(0, 2).map((admin, i) => (
                            <Box
                              /* eslint-disable-next-line react/no-array-index-key */
                              key={`${admin.full_name}+${i}`}
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              mr={3}
                              data-testid-table-admin={admin.full_name}
                            >
                              <Avatar src={admin.avatar} sizes="30" />
                              <Box pl={1}>
                                <Typography className={classes.adminName}>{admin.full_name}</Typography>
                                <Typography className={classes.adminEmail}>{admin.email}</Typography>
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    )}
                  />
                </TableCell>
                {hasBudgetManagementSetup && (
                  <BudgetCell teamId={team.id} isLoading={isBudgetsLoading} onBudgetClick={handleClickBudget} />
                )}
              </TableRow>
            ))}
          </TableBody>
          {showPagination && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[pagination.per_page]}
                  colSpan={12}
                  count={handledItems.length}
                  labelDisplayedRows={({ from, to, count }) => (
                    <>
                      {`${from}-${to} of `}
                      <span data-testid-pagination-caption={1}>{count}</span>
                    </>
                  )}
                  rowsPerPage={pagination.per_page}
                  page={currentPage - 1}
                  onPageChange={(event, nextPage) => setCurrentPage(nextPage + 1)}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      )}
      <TeamSidebar />
    </Box>
  );
};

export default memo(TeamListTable);
