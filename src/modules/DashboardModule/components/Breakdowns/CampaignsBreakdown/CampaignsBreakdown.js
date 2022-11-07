import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SearchField } from '@alycecom/ui';
import { Grid, MenuItem } from '@mui/material';

import { teamBreakdownShape } from '../../../shapes/teamBreakdown.shape';
import SelectFilter from '../../../../../components/Dashboard/Header/SelectFilter';
import { teamShape } from '../../../../../shapes/team.shape';
import EmptyDataset from '../../../../../components/Shared/EmptyDataset';

import CampaignsBreakdownTable from './CampaignsBreakdownTable';

export const CampaignsBreakdownComponent = ({
  breakdown,
  search,
  sort,
  sortDirection,
  onFilterChange,
  showTeamFilter,
  isLoading,
  campaignLink,
  page,
  teams,
  teamId,
  teamName,
  isLoaded,
}) => {
  const handleSort = useCallback(
    column => {
      onFilterChange({
        campaignsSort: column,
        campaignsDirection: sort === column && sortDirection === 'desc' ? 'asc' : 'desc',
        campaignsPage: 0,
      });
    },
    [sort, sortDirection, onFilterChange],
  );

  const handlePageChange = useCallback(
    nextPage => {
      onFilterChange({
        campaignsPage: nextPage,
      });
    },
    [onFilterChange],
  );

  const showTable = !(isLoaded && breakdown.length === 0);
  const filterTeams = useMemo(() => [{ id: '', name: 'All teams' }, ...teams], [teams]);
  const currentPage = useMemo(() => (page === '' ? 0 : parseInt(page, 10)), [page]);

  return showTable ? (
    <CampaignsBreakdownTable
      isLoading={isLoading}
      items={breakdown}
      sort={sort}
      sortDirection={sortDirection}
      page={currentPage}
      onPageChange={handlePageChange}
      campaignLink={campaignLink}
      onSort={handleSort}
      renderToolbar={() => (
        <Grid container direction="row" wrap="nowrap">
          <SearchField
            placeholder="Search campaigns"
            value={search}
            onChange={event => onFilterChange({ campaignsSearch: event.target.value, campaignsPage: 0 })}
          />
          {showTeamFilter && (
            <SelectFilter
              onFilterChange={e => onFilterChange({ ...e, campaignsPage: 0 })}
              renderItems={() =>
                filterTeams.map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))
              }
              label="All teams"
              value={teamId}
              name="teamId"
            />
          )}
        </Grid>
      )}
    />
  ) : (
    <EmptyDataset dataSetName="campaign" teamName={teamName} />
  );
};

CampaignsBreakdownComponent.propTypes = {
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  search: PropTypes.string,
  sort: PropTypes.string,
  sortDirection: PropTypes.string,
  breakdown: PropTypes.arrayOf(teamBreakdownShape).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  campaignLink: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(teamShape),
  showTeamFilter: PropTypes.bool,
  teamId: PropTypes.string,
  page: PropTypes.string,
  teamName: PropTypes.string,
};

CampaignsBreakdownComponent.defaultProps = {
  isLoading: false,
  isLoaded: false,
  showTeamFilter: false,
  search: '',
  sort: '',
  teamId: '',
  teams: [],
  page: '',
  sortDirection: 'desc',
  teamName: '',
};

export default CampaignsBreakdownComponent;
