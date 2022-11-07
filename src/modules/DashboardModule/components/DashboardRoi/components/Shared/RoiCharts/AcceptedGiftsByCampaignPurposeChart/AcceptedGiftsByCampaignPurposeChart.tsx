import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  ROI_CAMPAIGN_PURPOSES,
  TAcceptedGiftByCampaignPurpose,
  useGetAcceptedGiftsByCampaignPurposeQuery,
} from '@alycecom/services';

import { StyledRoiSectionTitle } from '../../index';
import { RoiHorizontalBarChartWrapper } from '../../RoiHorizontalBarChartWrapper';
import { TRoiChartAxisTypes } from '../../../../utils/roiTypes';
import { getRoiFilters } from '../../../../store/filters/filters.selectors';
import { NumberFormattingOptions, toFormattedPrice } from '../../../../utils';
import { RoiTooltipRow } from '../../RoiChartTooltip';

const styles = {
  title: { margin: '4px 0 32px 16px' },
  container: { height: '940px', marginBottom: 7 },
} as const;

const DEFAULT_CHART_DATA = ROI_CAMPAIGN_PURPOSES.map(({ value }) => ({
  campaignPurpose: value,
  gifts: 0,
  totalCost: '0.00',
  costPerGift: '0.00',
}));
const getCampaignPurposeLabel = (d: TAcceptedGiftByCampaignPurpose): string =>
  ROI_CAMPAIGN_PURPOSES?.find(cp => cp.value === d.campaignPurpose)?.label || '';
const getSentGiftsNumber = (d: TAcceptedGiftByCampaignPurpose) => d.gifts;

const AcceptedGiftsByCampaignPurposeChart = (): JSX.Element => {
  const globalFilters = useSelector(getRoiFilters);
  const { data, isFetching } = useGetAcceptedGiftsByCampaignPurposeQuery(globalFilters);
  const acceptedGiftsByCampaignPurpose = !isFetching && !!data?.data ? data.data : DEFAULT_CHART_DATA;

  const renderTooltip = (tooltipData: TAcceptedGiftByCampaignPurpose | Partial<TAcceptedGiftByCampaignPurpose>) => (
    <Box display="flex" flexDirection="column">
      <RoiTooltipRow label="Gifts Accepted" value={tooltipData.gifts?.toFixed(0)} />
      <RoiTooltipRow
        label="Spend"
        value={toFormattedPrice(Number(tooltipData.totalCost), NumberFormattingOptions.LargeWithDecimals)}
      />
      <RoiTooltipRow
        label="Median"
        value={`${toFormattedPrice(Number(tooltipData.costPerGift), NumberFormattingOptions.LargeWithDecimals)}/gift`}
      />
    </Box>
  );

  return (
    <>
      <Box mb={7}>
        <StyledRoiSectionTitle sx={styles.title}>Accepted Gifts by Campaign Purpose</StyledRoiSectionTitle>
      </Box>
      <Box sx={styles.container}>
        <RoiHorizontalBarChartWrapper
          data={acceptedGiftsByCampaignPurpose}
          XGetter={getSentGiftsNumber}
          YGetter={getCampaignPurposeLabel}
          tooltipRender={renderTooltip}
          isLoading={isFetching}
          axisTicksFormat={{ type: TRoiChartAxisTypes.Numerical }}
        />
      </Box>
    </>
  );
};

export default AcceptedGiftsByCampaignPurposeChart;
