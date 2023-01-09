import React, { memo, useCallback, useMemo } from 'react';
import { SearchField, DateRangeSelect } from '@alycecom/ui';
import PropTypes from 'prop-types';
import { updateSearch } from '@alycecom/modules';
import { Box, FormControlLabel, Grid, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';
import { useSelector } from 'react-redux';
import { TrackEvent } from '@alycecom/services';

import { teamBreakdownShape } from '../../../shapes/teamBreakdown.shape';
import { getTeams } from '../../../../../store/teams/teams.selectors';

import TeamsBreakdownTable from './TeamsBreakdownTable';

const useStyles = makeStyles(() => ({
  dateRangeFilter: {
    flexGrow: 1,
  },
}));

const TeamsBreakdown = ({ breakdown, isLoading, onChangeDateRange }) => {
  const classes = useStyles();
  const {
    teamsSort = 'name',
    teamsDirection = 'asc',
    teamsSearch = '',
    teamsPage = '0',
    dateRangeFrom = '',
    includeArchived = 'false',
    dateRangeTo = '',
  } = useUrlQuery([
    'teamsSort',
    'includeArchived',
    'teamsDirection',
    'teamsSearch',
    'teamsPage',
    'dateRangeFrom',
    'dateRangeTo',
  ]);
  const updateUrl = useSetUrlQuery();
  const teams = useSelector(getTeams);
  const isShowArchivedToggle = useMemo(() => teams.filter(item => item.archivedAt !== null).length > 0, [teams]);
  const { trackEvent } = TrackEvent.useTrackEvent();

  const handleIncludeArchived = useCallback(
    (_, status) => {
      trackEvent('Include archived — clicked', { page: 'dashboardTeams', includeArchived: status ? 'yes' : 'no' });
      updateUrl({
        includeArchived: status,
      });
    },
    [trackEvent, updateUrl],
  );

  const handleSort = useCallback(
    column => {
      updateUrl({
        teamsSort: column,
        teamsDirection: teamsSort === column && teamsDirection === 'desc' ? 'asc' : 'desc',
        teamsPage: 0,
      });
    },
    [teamsSort, teamsDirection, updateUrl],
  );

  const onPageChange = useCallback(page => updateUrl({ teamsPage: page }), [updateUrl]);

  const onSearch = useCallback(event => updateUrl({ teamsSearch: event.target.value, teamsPage: 0 }), [updateUrl]);

  return (
    <TeamsBreakdownTable
      isLoading={isLoading}
      items={breakdown}
      sort={teamsSort}
      dir={teamsDirection}
      onSort={handleSort}
      page={Number(teamsPage)}
      onPageChange={onPageChange}
      linkQueryParams={updateSearch('', { dateRangeFrom, dateRangeTo })}
      renderToolbar={() => (
        <Grid container direction="column" wrap="nowrap" xs={12}>
          <Grid container direction="row" wrap="nowrap" xs={12}>
            <Grid item xs={10}>
              <SearchField placeholder="Search teams" value={teamsSearch} onChange={onSearch} />
            </Grid>
            <Grid item xs={2}>
              <Box ml={1} display="flex">
                <DateRangeSelect
                  className={classes.dateRangeFilter}
                  disabled={isLoading}
                  from={dateRangeFrom}
                  to={dateRangeTo}
                  onChange={onChangeDateRange}
                />
              </Box>
            </Grid>
          </Grid>
          {isShowArchivedToggle && (
            <Grid container xs={12} justifyContent="flex-end">
              <FormControlLabel
                control={
                  <Switch checked={includeArchived === 'true'} onChange={handleIncludeArchived} color="primary" />
                }
                label="Include archived"
              />
            </Grid>
          )}
        </Grid>
      )}
    />
  );
};

TeamsBreakdown.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  breakdown: PropTypes.arrayOf(teamBreakdownShape).isRequired,
  onChangeDateRange: PropTypes.func.isRequired,
};

export default memo(TeamsBreakdown);
