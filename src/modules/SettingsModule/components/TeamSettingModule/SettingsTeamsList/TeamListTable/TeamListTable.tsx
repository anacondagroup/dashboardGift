import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import * as R from 'ramda';
import { AlyceTheme, SearchField } from '@alycecom/ui';
import { SortDirection } from '@alycecom/utils';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Features, HasFeature } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';

import { usePagination } from '../../../../../../hooks/usePagination';
import EmptyDataset from '../../../../../../components/Shared/EmptyDataset';
import { getIsLoaded, getIsLoading, getTeamIds, getTeams } from '../../../../store/teams/teams/teams.selectors';
import { ITeam } from '../../../../store/teams/teams/teams.types';
import { clearTeamsSetting, loadTeamsSettingsRequest } from '../../../../store/teams/teams/teams.actions';
import { setTeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../store/teams/teamOperation/teamOperation.types';
import TeamSidebar from '../TeamSidebar/TeamSidebar';
import { loadBudgets } from '../../../../store/teams/budgets/budgets.actions';

import ArchiveTeamConfirmation from './ArchiveTeamConfirmation';
import { TeamRow } from './Rows';

const styles = {
  createButton: {
    width: 150,
    height: 48,
    color: ({ palette }: AlyceTheme) => palette.common.white,
    backgroundColor: ({ palette }: AlyceTheme) => palette.green.dark,
    '&:hover': {
      color: ({ palette }: AlyceTheme) => palette.common.white,
      backgroundColor: ({ palette }: AlyceTheme) => palette.green.mountainMeadowLight,
    },
  },
} as const;

const TEAMS_PER_PAGE = 10;

export interface ITeamListTableProps {
  onSelect: (id: number) => void;
}

const TeamListTable = ({ onSelect }: ITeamListTableProps): JSX.Element => {
  const dispatch = useDispatch();

  const isLoaded = useSelector(getIsLoaded);
  const isLoading = useSelector(getIsLoading);

  const teams = useSelector(getTeams);
  const teamIds = useSelector(getTeamIds);
  const { trackEvent } = TrackEvent.useTrackEvent();
  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.asc);
  const [search, onSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);

  const handleIncludeArchived = useCallback(
    (_, status) => {
      trackEvent('Include archived — clicked', { page: 'teamsSettings', includeArchived: status ? 'yes' : 'no' });
      setIncludeArchived(!includeArchived);
    },
    [trackEvent, includeArchived],
  );

  const handleSort = useCallback(
    column => {
      setSortColumn(column);
      setSortDirection(sortDirection === SortDirection.asc ? SortDirection.desc : SortDirection.asc);
    },
    [sortDirection],
  );

  const hasTeams = (isLoaded && teams.length > 0) || isLoading;

  const handledItems = useMemo<ITeam[]>(() => {
    const direction = sortDirection === SortDirection.asc ? R.ascend : R.descend;
    const sortByColumn: (teams: ITeam[]) => ITeam[] = R.sort(direction(R.path(sortColumn.split('.'))));
    const searchByName = ({ name }: ITeam) => R.includes(R.toLower(search), R.toLower(name));
    const filterFn: (teams: ITeam[]) => ITeam[] = search ? R.filter(searchByName) : R.identity;
    return R.pipe(filterFn, sortByColumn)(teams);
  }, [search, sortColumn, sortDirection, teams]);

  const [itemsToShow, showPagination] = usePagination<ITeam>(currentPage - 1, TEAMS_PER_PAGE, handledItems, isLoading);

  const handleCreateTeam = useCallback(() => {
    dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamInfo }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadTeamsSettingsRequest({ includeArchived }));
    return () => {
      dispatch(clearTeamsSetting());
    };
  }, [dispatch, includeArchived]);

  useEffect(() => {
    if (hasBudgetManagementSetup) {
      dispatch(loadBudgets({ teamIds }));
    }
  }, [dispatch, hasBudgetManagementSetup, teamIds]);

  return (
    <>
      <Box p={3} style={{ overflowX: 'auto' }}>
        <Box mb={3}>
          <Grid container direction="row" wrap="nowrap">
            <SearchField
              placeholder="Search teams"
              value={search}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
            />
            <Box minWidth={140} ml={2}>
              <Button
                sx={styles.createButton}
                variant="contained"
                disabled={isLoading}
                onClick={handleCreateTeam}
                data-testid="TeamManagement.CreateTeam"
              >
                Create a team
              </Button>
            </Box>
          </Grid>
          <HasFeature featureKey={Features.FLAGS.ARCHIVE_TEAMS}>
            <Grid>
              <FormControlLabel
                control={<Switch checked={includeArchived} onChange={handleIncludeArchived} color="primary" />}
                label="Include archived"
              />
            </Grid>
          </HasFeature>
        </Box>
        {hasTeams && (
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
                <TableCell width={150} align="right">
                  <TableSortLabel
                    direction={sortDirection}
                    active={sortColumn === 'members.amount'}
                    onClick={() => handleSort('members.amount')}
                  >
                    Members
                  </TableSortLabel>
                </TableCell>
                <TableCell width={400} align="left">
                  Admin(s)
                </TableCell>
                {hasBudgetManagementSetup && (
                  <TableCell width={200} align="right">
                    Budget Assigned
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsToShow.map(team => (
                <TeamRow disabled={!team.isAdmin} key={team.id} team={team} onSelect={onSelect} />
              ))}
            </TableBody>
            {showPagination && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[TEAMS_PER_PAGE]}
                    colSpan={12}
                    count={handledItems.length}
                    labelDisplayedRows={({ from, to, count }) => (
                      <>
                        {`${from}-${to} of `}
                        <span data-testid-pagination-caption={1}>{count}</span>
                      </>
                    )}
                    rowsPerPage={TEAMS_PER_PAGE}
                    page={currentPage - 1}
                    onPageChange={(event, nextPage) => setCurrentPage(nextPage + 1)}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        )}
        {!hasTeams && (
          <Box pt={8} pb={8}>
            <EmptyDataset dataSetName="teams" />
          </Box>
        )}
        <TeamSidebar />
      </Box>
      <ArchiveTeamConfirmation includeArchived={includeArchived} />
    </>
  );
};

export default memo(TeamListTable);
