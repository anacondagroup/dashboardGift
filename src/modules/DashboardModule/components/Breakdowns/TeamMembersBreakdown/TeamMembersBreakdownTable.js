import React from 'react';
import classNames from 'classnames';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Avatar,
  Grid,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { TableCellTooltip, TableLoadingLabel, DashboardIcon } from '@alycecom/ui';

import { teamBreakdownMemberShape } from '../../../shapes/teamBreakdownMember.shape';
import { usePagination } from '../../../../../hooks/usePagination';

const styles = theme => ({
  avatar: {
    marginRight: theme.spacing(1),
  },
  fakeAvatar: {
    backgroundColor: theme.palette.divider,
  },
  fakeAvatarIcon: {
    width: 'initial',
    color: theme.palette.common.white,
    fontSize: '1rem',
    height: '1rem',
  },
});

export const TeamMembersBreakdownTableComponent = ({
  renderToolbar,
  items,
  sort,
  sortDirection,
  onSort,
  classes,
  isLoading,
  memberLink,
  page,
  onPageChange,
}) => {
  const rowsPerPage = 10;
  const [members, showPagination, emptyRows, showEmptyRows] = usePagination(page, rowsPerPage, items, isLoading);

  return (
    <>
      {renderToolbar()}
      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                direction={sortDirection}
                active={sort === 'first_name'}
                onClick={() => onSort('first_name')}
              >
                team member name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                direction={sortDirection}
                active={sort === 'gifts_sent'}
                onClick={() => onSort('gifts_sent')}
              >
                gifts sent
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                direction={sortDirection}
                active={sort === 'gifts_viewed'}
                onClick={() => onSort('gifts_viewed')}
              >
                gifts viewed
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                direction={sortDirection}
                active={sort === 'gifts_accepted'}
                onClick={() => onSort('gifts_accepted')}
              >
                gifts accepted
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                direction={sortDirection}
                active={sort === 'meetings_booked'}
                onClick={() => onSort('meetings_booked')}
              >
                meetings booked
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map(member => (
            <TableRow key={member.id}>
              <TableCell component="th" scope="row">
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap">
                  {isLoading || !member.avatar ? (
                    <Avatar className={classNames(classes.avatar, classes.fakeAvatar)}>
                      <DashboardIcon icon="user" className={classes.fakeAvatarIcon} />
                    </Avatar>
                  ) : (
                    <Avatar
                      alt={`${member.firstName} ${member.lastName}`}
                      src={member.avatar}
                      className={classes.avatar}
                    />
                  )}
                  <TableLoadingLabel
                    maxWidth={400}
                    pr={2}
                    isLoading={isLoading}
                    render={() => (
                      <TableCellTooltip
                        title={`${member.firstName} ${member.lastName}`}
                        renderLabel={() => (
                          <RouterLink to={memberLink(member.id)}>{`${member.firstName} ${member.lastName}`}</RouterLink>
                        )}
                      />
                    )}
                  />
                </Grid>
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => member.giftsSent}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => member.giftsViewed}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => member.giftsAccepted}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => member.meetingsBooked}
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
                onPageChange={(event, nextPage) => onPageChange(nextPage)}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

TeamMembersBreakdownTableComponent.propTypes = {
  memberLink: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  sort: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  renderToolbar: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(teamBreakdownMemberShape).isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(TeamMembersBreakdownTableComponent);
