import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { TrackEvent } from '@alycecom/services';
import { TableCellTooltip, TableLoadingLabel } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { Features } from '@alycecom/modules';

import { teamBreakdownShape } from '../../../shapes/teamBreakdown.shape';
import { usePagination } from '../../../../../hooks/usePagination';
import { giftBreakDownClear } from '../../../store/breakdowns/gift/gift.actions';
import { getCampaignTypeName } from '../../../../../helpers/campaignSettings.helpers';
import CampaignStatusLabel from '../../DashboardCampaigns/CampaignsManagement/CampaignStatusLabel';

export const CampaignsBreakdownTableComponent = ({
  renderToolbar,
  items,
  sort,
  sortDirection,
  onSort,
  isLoading,
  campaignLink,
  page,
  onPageChange,
}) => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const dispatch = useDispatch();
  const rowsPerPage = 10;
  const [campaigns, showPagination, emptyRows, showEmptyRows] = usePagination(page, rowsPerPage, items, isLoading);

  const hasA4MFeatureFlag = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.ALYCE_FOR_MARKETING), []),
  );

  return (
    <>
      {renderToolbar()}
      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel direction={sortDirection} active={sort === 'name'} onClick={() => onSort('name')}>
                campaign name
              </TableSortLabel>
            </TableCell>
            <TableCell align="left">
              <TableSortLabel direction={sortDirection} active={sort === 'type'} onClick={() => onSort('type')}>
                type
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
                meeting booked
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map(campaign => (
            <TableRow key={campaign.id}>
              <TableCell component="th" scope="row">
                <Box display="flex" flexDirection="column" justifyContent="flex-start" pr={2}>
                  <TableLoadingLabel
                    maxWidth={400}
                    isLoading={isLoading}
                    render={() => (
                      <TableCellTooltip
                        renderLabel={() => (
                          <RouterLink
                            onClick={() => {
                              trackEvent('Enterprise dashboard — link from campaigns page to single campaign view', {
                                campaign_id: campaign.id,
                              });
                              dispatch(giftBreakDownClear()); // TODO: Хак чтобы избежать падения при попытке заполнить таблицу гифтами из стандартной кампании в иную другую
                            }}
                            to={campaignLink(campaign.id)}
                          >
                            {campaign.name}
                          </RouterLink>
                        )}
                        title={campaign.name}
                      />
                    )}
                  />
                  {!isLoading && <CampaignStatusLabel campaignStatus={campaign.status} />}
                </Box>
              </TableCell>
              <TableCell align="left">
                <TableLoadingLabel
                  pr={2}
                  maxWidth={270}
                  isLoading={isLoading}
                  render={() => `${getCampaignTypeName(campaign.type, hasA4MFeatureFlag)}`}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => campaign.giftsSent}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => campaign.giftsViewed}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => campaign.giftsAccepted}
                />
              </TableCell>
              <TableCell align="right">
                <TableLoadingLabel
                  align="right"
                  pl={2}
                  maxWidth={190}
                  isLoading={isLoading}
                  render={() => campaign.meetingsBooked}
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

CampaignsBreakdownTableComponent.propTypes = {
  sort: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  sortDirection: PropTypes.string.isRequired,
  renderToolbar: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(teamBreakdownShape).isRequired,
  campaignLink: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default CampaignsBreakdownTableComponent;
