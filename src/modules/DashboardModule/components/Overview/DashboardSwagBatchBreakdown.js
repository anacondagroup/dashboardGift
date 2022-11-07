import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fakeItemsFactory } from '@alycecom/utils';
import { DashboardIcon, SearchField, ActionButton, TableLoadingLabel } from '@alycecom/ui';

import { getSwagBatchesBreakdownState } from '../../store/breakdowns/swagBatches/swagBatches.selectors';
import {
  swagBatchesBreakdownClear,
  swagBatchesBreakdownDataRequest,
} from '../../store/breakdowns/swagBatches/swagBatches.actions';
import {
  // TODO: get rid of the dependency on SettingsModule
  createCampaignSidebarAddSwagDigitalCodes,
  createCampaignSidebarAddSwagPhysicalCodes,
} from '../../../SettingsModule/store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import { swagDigitalCodesGenerateFlowWizardRequest } from '../../../SettingsModule/store/campaign/swagDigitalCodes/swagDigitalCodes.actions';
import HasPermission from '../../../../hoc/HasPermission/HasPermission';
import { PermissionKeys } from '../../../../constants/permissions.constants';
import { SWAG_DIGITAL, SWAG_PHYSICAL } from '../../../../constants/swagSelect.constants';
import { swagPhysicalCodesGenerateFlowWizardRequest } from '../../../SettingsModule/store/campaign/swagPhysicalCodes/swagPhysicalCodes.actions';

const BATCH_NAME_COL = 'batch name';
const CREATED_COL = 'created';
const GIFTS_VIEWED_COL = 'viewed';
const GIFTS_CLAIMED_COL = 'claimed';
const MEETINGS_BOOKED_COL = 'meetings booked';
const CREATED_BY_COL = 'batch owner';

const sortBy = (column, dir) => {
  const direction = dir === 'asc' ? R.ascend : R.descend;
  let sortedValue;
  switch (column) {
    case BATCH_NAME_COL:
      sortedValue = R.pipe(R.prop('name'), R.toLower);
      break;
    case CREATED_COL:
      sortedValue = R.prop('codesCreated');
      break;
    case GIFTS_VIEWED_COL:
      sortedValue = R.prop('codesViewed');
      break;
    case GIFTS_CLAIMED_COL:
      sortedValue = R.prop('codesClaimed');
      break;
    case MEETINGS_BOOKED_COL:
      sortedValue = R.prop('meetingsBooked');
      break;
    case CREATED_BY_COL:
      sortedValue = R.pipe(R.prop('batchOwnerFullName'), R.toLower);
      break;
    default:
      sortedValue = R.prop('name');
  }
  return R.sort(direction(sortedValue));
};

const DashboardSwagBatchBreakdown = ({
  campaignId,
  teamId,
  dateRangeFrom,
  dateRangeTo,
  forceUpdate,
  canEditCampaign,
  campaignType,
}) => {
  const dispatch = useDispatch();
  const [search, setSearchValue] = useState('');
  const [sortColumn, setSortColumn] = useState(BATCH_NAME_COL);
  const [sortDir, setSortDir] = useState('asc');
  const { batches, isLoading } = useSelector(getSwagBatchesBreakdownState);

  useEffect(() => {
    dispatch(swagBatchesBreakdownDataRequest({ campaignId, dateRangeFrom, dateRangeTo }));
    return () => {
      dispatch(swagBatchesBreakdownClear());
    };
  }, [dateRangeFrom, dateRangeTo, campaignId, forceUpdate, dispatch]);

  const handleGenerateMoreCodes = useCallback(() => {
    if (campaignType === SWAG_DIGITAL) {
      dispatch(createCampaignSidebarAddSwagDigitalCodes());
      dispatch(swagDigitalCodesGenerateFlowWizardRequest({ campaignId, teamId }));
    }
    if (campaignType === SWAG_PHYSICAL) {
      dispatch(createCampaignSidebarAddSwagPhysicalCodes());
      dispatch(swagPhysicalCodesGenerateFlowWizardRequest({ campaignId, teamId }));
    }
  }, [campaignType, dispatch, campaignId, teamId]);

  const handleSort = useCallback(
    column => {
      setSortColumn(column);
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    },
    [sortDir, setSortColumn, setSortDir],
  );

  const batchesList = useMemo(() => {
    if (isLoading || !batches) {
      return fakeItemsFactory(batches || [], isLoading, () => ({}), 3);
    }
    return sortBy(
      sortColumn,
      sortDir,
    )(search ? batches.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : batches);
  }, [batches, isLoading, search, sortColumn, sortDir]);

  return (
    <>
      <Box display="flex">
        <SearchField placeholder="Search batch" value={search || ''} onChange={e => setSearchValue(e.target.value)} />
        {canEditCampaign && (
          <HasPermission permissionKey={PermissionKeys.EditCampaigns}>
            <Box width="230px" ml={1}>
              <ActionButton width="100%" onClick={handleGenerateMoreCodes}>
                Generate more codes
              </ActionButton>
            </Box>
          </HasPermission>
        )}
      </Box>
      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                direction={sortDir}
                active={sortColumn === BATCH_NAME_COL}
                onClick={() => handleSort(BATCH_NAME_COL)}
              >
                {BATCH_NAME_COL}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={sortDir}
                active={sortColumn === CREATED_COL}
                onClick={() => handleSort(CREATED_COL)}
              >
                {CREATED_COL}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={sortDir}
                active={sortColumn === GIFTS_VIEWED_COL}
                onClick={() => handleSort(GIFTS_VIEWED_COL)}
              >
                {GIFTS_VIEWED_COL}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={sortDir}
                active={sortColumn === GIFTS_CLAIMED_COL}
                onClick={() => handleSort(GIFTS_CLAIMED_COL)}
              >
                {GIFTS_CLAIMED_COL}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={sortDir}
                active={sortColumn === MEETINGS_BOOKED_COL}
                onClick={() => handleSort(MEETINGS_BOOKED_COL)}
              >
                {MEETINGS_BOOKED_COL}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                direction={sortDir}
                active={sortColumn === CREATED_BY_COL}
                onClick={() => handleSort(CREATED_BY_COL)}
              >
                {CREATED_BY_COL}
              </TableSortLabel>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {batchesList &&
            batchesList.map((batch, i) => (
              <TableRow key={batch.id || i}>
                <TableCell>
                  <TableLoadingLabel pr={2} maxWidth={190} isLoading={isLoading} render={() => batch.name} />
                </TableCell>
                <TableCell>
                  <TableLoadingLabel pr={2} maxWidth={190} isLoading={isLoading} render={() => batch.codesCreated} />
                </TableCell>
                <TableCell>
                  <TableLoadingLabel
                    pr={2}
                    maxWidth={190}
                    isLoading={isLoading}
                    render={() =>
                      batch.codesViewed === 0
                        ? '0 (0%)'
                        : `${batch.codesViewed} (${numeral(batch.codesViewed / batch.codesCreated).format('0%')})`
                    }
                  />
                </TableCell>
                <TableCell>
                  <TableLoadingLabel
                    pr={2}
                    maxWidth={190}
                    isLoading={isLoading}
                    render={() =>
                      batch.codesClaimed === 0
                        ? `0 (0%)`
                        : `${batch.codesClaimed} (${numeral(batch.codesClaimed / batch.codesViewed).format('0%')})`
                    }
                  />
                </TableCell>
                <TableCell>
                  <TableLoadingLabel
                    pr={2}
                    maxWidth={190}
                    isLoading={isLoading}
                    render={() =>
                      batch.meetingsBooked === 0
                        ? `0 (0%)`
                        : `${batch.meetingsBooked} (${numeral(batch.meetingsBooked / batch.codesViewed).format('0%')}`
                    }
                  />
                </TableCell>
                <TableCell>
                  <TableLoadingLabel
                    pr={2}
                    maxWidth={190}
                    isLoading={isLoading}
                    render={() => (
                      <Box display="flex" flexDirection="column">
                        <Box>{batch.batchOwnerFullName}</Box>
                        <Box className="Body-Small-Inactive">{moment(batch.codesCreatedAt).format('D MMM Y')}</Box>
                      </Box>
                    )}
                  />
                </TableCell>
                {canEditCampaign && (
                  <HasPermission permissionKey={PermissionKeys.EditCampaigns}>
                    <TableCell>
                      <TableLoadingLabel
                        pr={2}
                        maxWidth={190}
                        isLoading={isLoading}
                        render={() => (
                          <a href={batch.codesCsvFileLink}>
                            <Box display="flex" alignItems="center">
                              <DashboardIcon icon="file-download" color="link" />
                              <Box ml={1} className="Body-Regular-Center-Link">
                                Download CSV
                              </Box>
                            </Box>
                          </a>
                        )}
                      />
                    </TableCell>
                  </HasPermission>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

DashboardSwagBatchBreakdown.propTypes = {
  campaignType: PropTypes.string.isRequired,
  forceUpdate: PropTypes.number.isRequired,
  dateRangeFrom: PropTypes.string,
  dateRangeTo: PropTypes.string,
  campaignId: PropTypes.number.isRequired,
  teamId: PropTypes.number.isRequired,
  canEditCampaign: PropTypes.bool,
};

DashboardSwagBatchBreakdown.defaultProps = {
  dateRangeFrom: '',
  dateRangeTo: '',
  canEditCampaign: false,
};

export default DashboardSwagBatchBreakdown;
