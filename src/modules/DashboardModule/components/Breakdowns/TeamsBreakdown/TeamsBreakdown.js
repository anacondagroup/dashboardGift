import React, { memo, useCallback } from 'react';
import { SearchField, DateRangeSelect } from '@alycecom/ui';
import PropTypes from 'prop-types';
import { updateSearch } from '@alycecom/modules';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import { teamBreakdownShape } from '../../../shapes/teamBreakdown.shape';

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
    dateRangeTo = '',
  } = useUrlQuery(['teamsSort', 'teamsDirection', 'teamsSearch', 'teamsPage', 'dateRangeFrom', 'dateRangeTo']);
  const updateUrl = useSetUrlQuery();

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
