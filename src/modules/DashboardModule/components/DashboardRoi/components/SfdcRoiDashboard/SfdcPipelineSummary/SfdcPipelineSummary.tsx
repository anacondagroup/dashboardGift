import React, { memo, useCallback } from 'react';
import { Box } from '@mui/material';
import { useGetSfdcSummaryQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';

import salesforceLogo from '../../../assets/images/salesforce-icon.svg';
import RoiSummaryTile from '../../Shared/RoiSummaryTile/RoiSummaryTile';
import { toFormattedPrice, toRoi } from '../../../utils';
import { StyledRoiSectionTitle } from '../../Shared';
import { getRoiFilters } from '../../../store/filters/filters.selectors';

const SfdcPipelineSummary = (): JSX.Element => {
  const globalFilters = useSelector(getRoiFilters);
  const { data, isFetching } = useGetSfdcSummaryQuery(globalFilters);

  const totalSpendFormatter = useCallback(value => toFormattedPrice(value, '0,'), []);
  const roiFormatter = useCallback(value => toRoi(value), []);

  return (
    <Box>
      <Box mb={3} display="flex">
        <StyledRoiSectionTitle>Pipeline Summary</StyledRoiSectionTitle>
        <Box ml={3} mr={2} display="flex" alignItems="center">
          from
        </Box>
        <img src={salesforceLogo} alt="SalesForce logo" height={30} />
      </Box>

      <Box display="flex" justifyContent="space-between">
        <RoiSummaryTile
          label="Influenced Open Revenue"
          value={data?.data.claimedGiftsOpportunitiesSum}
          isLoading={isFetching}
          tooltipText="Sum of the opportunity value that is still Open where a gift influenced the opportunity"
        />
        <RoiSummaryTile
          label="Closed-Won Revenue"
          value={data?.data.closedWonOpportunitiesSum}
          isLoading={isFetching}
          color="green.fruitSalad"
          tooltipText="Sum of the opportunity value that was Closed-Won where a gift influenced the opportunity"
        />
        <RoiSummaryTile
          label="Total Influenced"
          value={data?.data.totalInfluenced}
          isLoading={isFetching}
          tooltipText="Sum of the opportunity value for all opportunities where a gift influenced the opportunity (Influenced Open ARR + Closed-Won ARR)"
        />
        <RoiSummaryTile
          label="Total Spend"
          value={data?.data.totalSpend}
          isLoading={isFetching}
          formatter={totalSpendFormatter}
          tooltipText="Total amount of spend on accepted gifts"
        />
        <RoiSummaryTile
          label="ROI"
          value={data?.data.roi}
          isLoading={isFetching}
          formatter={roiFormatter}
          tooltipText="Total Closed-Won Revenue measured as a return on gift spend"
        />
      </Box>
    </Box>
  );
};

export default memo(SfdcPipelineSummary);
