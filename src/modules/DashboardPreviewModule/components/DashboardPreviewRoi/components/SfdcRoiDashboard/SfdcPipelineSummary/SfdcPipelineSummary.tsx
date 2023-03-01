import React, { memo, useCallback } from 'react';
import { Box } from '@mui/material';

import salesforceLogo from '../../../../../../DashboardModule/components/DashboardRoi/assets/images/salesforce-icon.svg';
import {
  RoiSummaryTile,
  StyledRoiSectionTitle,
} from '../../../../../../DashboardModule/components/DashboardRoi/components/Shared';
import { toFormattedPrice, toRoi } from '../../../../../../DashboardModule/components/DashboardRoi/utils';
import { dashboardMock } from '../../../../../dashboardmockup';

const SfdcPipelineSummary = (): JSX.Element => {
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
          value={dashboardMock.summary[0]}
          tooltipText="Sum of the opportunity value that is still Open where a gift influenced the opportunity"
        />
        <RoiSummaryTile
          label="Closed-Won Revenue"
          value={dashboardMock.summary[1]}
          color="green.fruitSalad"
          tooltipText="Sum of the opportunity value that was Closed-Won where a gift influenced the opportunity"
        />
        <RoiSummaryTile
          label="Total Influenced"
          value={dashboardMock.summary[2]}
          tooltipText="Sum of the opportunity value for all opportunities where a gift influenced the opportunity (Influenced Open Revenue + Closed-Won Revenue)"
        />
        <RoiSummaryTile
          label="Total Spend"
          value={dashboardMock.summary[3]}
          formatter={totalSpendFormatter}
          tooltipText="Total gift spend"
        />
        <RoiSummaryTile
          label="ROI"
          value={dashboardMock.summary[4]}
          formatter={roiFormatter}
          tooltipText="Total Closed-Won Revenue measured as a return on gift spend"
        />
      </Box>
    </Box>
  );
};

export default memo(SfdcPipelineSummary);
