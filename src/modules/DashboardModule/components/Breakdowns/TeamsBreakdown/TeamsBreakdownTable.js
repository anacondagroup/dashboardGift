import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { DISPLAY_DATE_FORMAT, TableCellTooltip, TableLoadingLabel } from '@alycecom/ui';
import { TrackEvent } from '@alycecom/services';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Typography,
} from '@mui/material';
import moment from 'moment';

import { teamBreakdownShape } from '../../../shapes/teamBreakdown.shape';
import { usePagination } from '../../../../../hooks/usePagination';

export const TeamsBreakdownTableComponent = ({
  renderToolbar,
  items,
  onSort,
  dir,
  sort,
  isLoading,
  linkQueryParams,
  page,
  onPageChange,
}) => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const rowsPerPage = 10;
  const [teams, showPagination, emptyRows, showEmptyRows] = usePagination(page, rowsPerPage, items, isLoading);

  const pageChangeHandler = useCallback((_, nextPage) => onPageChange(nextPage), [onPageChange]);

  return (
    <>
      {renderToolbar()}
      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel direction={dir} active={sort === 'name'} onClick={() => onSort('name')}>
                team name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel direction={dir} active={sort === 'gifts_sent'} onClick={() => onSort('gifts_sent')}>
                gifts sent
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel direction={dir} active={sort === 'gifts_viewed'} onClick={() => onSort('gifts_viewed')}>
                gifts viewed
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                direction={dir}
                active={sort === 'gifts_accepted'}
                onClick={() => onSort('gifts_accepted')}
              >
                gifts accepted
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                direction={dir}
                active={sort === 'meetings_booked'}
                onClick={() => onSort('meetings_booked')}
              >
                meeting booked
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map(team => (
            <TableRow key={team.id}>
              <TableCell component="th" scope="row">
                <TableLoadingLabel
                  maxWidth={400}
                  pr={2}
                  isLoading={isLoading}
                  render={() => (
                    <TableCellTooltip
                      renderLabel={() => (
                        <RouterLink
                          onClick={() =>
                            trackEvent('Enterprise dashboard — link from teams page to single team view', {
                              team_id: team.id,
                            })
                          }
                          to={`/teams/${team.id}?${linkQueryParams}`}
                        >
                          {team.name}
                          {Boolean(team.archivedAt) && (
                            <Typography display="inline" noWrap color="#99A1BD">
                              &nbsp;(Archived {moment(team.archivedAt).format(DISPLAY_DATE_FORMAT)})
                            </Typography>
                          )}
                        </RouterLink>
                      )}
                      title={team.name}
                    />
                  )}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => team.giftsSent}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => team.giftsViewed}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => team.giftsAccepted}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => team.meetingsBooked}
                />
              </TableCell>
            </TableRow>
          ))}
          {showEmptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={12} />
            </TableRow>
          )}
        </TableBody>
        {showPagination && (
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                colSpan={12}
                count={items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  native: true,
                }}
                onPageChange={pageChangeHandler}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

TeamsBreakdownTableComponent.propTypes = {
  sort: PropTypes.string.isRequired,
  dir: PropTypes.string.isRequired,
  renderToolbar: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(teamBreakdownShape).isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  linkQueryParams: PropTypes.string,
};

TeamsBreakdownTableComponent.defaultProps = {
  linkQueryParams: '',
  isLoading: true,
};

export default TeamsBreakdownTableComponent;
