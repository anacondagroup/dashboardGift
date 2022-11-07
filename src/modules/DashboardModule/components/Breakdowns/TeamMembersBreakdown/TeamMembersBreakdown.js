import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SearchField } from '@alycecom/ui';

import { teamBreakdownMemberShape } from '../../../shapes/teamBreakdownMember.shape';
import EmptyDataset from '../../../../../components/Shared/EmptyDataset';

import TeamMembersBreakdownTable from './TeamMembersBreakdownTable';

export const TeamMembersBreakdownComponent = ({
  breakdown,
  search,
  sort,
  sortDirection,
  onFilterChange,
  isLoading,
  teamName,
  page,
  memberLink,
  isLoaded,
}) => {
  const handleSort = useCallback(
    column => {
      onFilterChange({
        teamMembersSort: column,
        teamMembersDirection: sort === column && sortDirection === 'desc' ? 'asc' : 'desc',
        teamMembersPage: 0,
      });
    },
    [sort, sortDirection, onFilterChange],
  );

  const handlePageChange = useCallback(
    nextPage => {
      onFilterChange({
        teamMembersPage: nextPage,
      });
    },
    [onFilterChange],
  );

  const showTable = useMemo(() => {
    if (isLoaded && breakdown.length === 0) {
      return false;
    }

    return true;
  }, [isLoaded, breakdown]);

  const currentPage = useMemo(() => (page === '' ? 0 : parseInt(page, 10)), [page]);

  return showTable ? (
    <TeamMembersBreakdownTable
      isLoading={isLoading}
      items={breakdown}
      sort={sort}
      sortDirection={sortDirection}
      page={currentPage}
      memberLink={memberLink}
      onSort={handleSort}
      onPageChange={handlePageChange}
      renderToolbar={() => (
        <SearchField
          placeholder={`Search ${teamName} members`}
          value={search}
          onChange={event => onFilterChange({ teamMembersSearch: event.target.value, teamMembersPage: 0 })}
        />
      )}
    />
  ) : (
    <EmptyDataset dataSetName="members" teamName={teamName} />
  );
};

TeamMembersBreakdownComponent.propTypes = {
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  search: PropTypes.string,
  sort: PropTypes.string,
  teamName: PropTypes.string,
  sortDirection: PropTypes.string,
  breakdown: PropTypes.arrayOf(teamBreakdownMemberShape).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  memberLink: PropTypes.func.isRequired,
  page: PropTypes.string,
};

TeamMembersBreakdownComponent.defaultProps = {
  isLoading: false,
  isLoaded: false,
  teamName: '',
  search: '',
  sort: '',
  sortDirection: 'desc',
  page: '',
};

export default TeamMembersBreakdownComponent;
