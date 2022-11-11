import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  ROI_CAMPAIGN_PURPOSES,
  TAcceptedGiftByCampaignPurpose,
  useGetAcceptedGiftsByCampaignPurposeQuery,
} from '@alycecom/services';
import { ParentSize } from '@visx/responsive';

import { RoiHorizontalBarChart } from '../../RoiHorizontalBarChart';
import { StyledRoiSectionTitle } from '../../index';
import { TRoiChartAxisTypes } from '../../../../utils/roiTypes';
import { getRoiFilters } from '../../../../store/filters/filters.selectors';
import { NumberFormattingOptions, toFormattedPrice } from '../../../../utils';
import { RoiTooltipRow } from '../../RoiChartTooltip';
import { RoiDownloadImage } from '../../RoiDownloadImage/RoiDownloadImage';

import { styles } from './AcceptedGiftsByCampaignPurposeChart.styles';

const CHART_TITLE = 'Accepted Gifts by Campaign Purpose';
const svgContainerId = 'accepted-gifts-svg';
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
      <Box sx={styles.titleContainer}>
        <StyledRoiSectionTitle sx={styles.title}>{CHART_TITLE}</StyledRoiSectionTitle>
        <RoiDownloadImage svgContainerId={svgContainerId} imageTitle={CHART_TITLE} />
      </Box>
      <Box sx={styles.container}>
        <ParentSize>
          {({ width, height, top }) => (
            <RoiHorizontalBarChart
              data={acceptedGiftsByCampaignPurpose}
              XGetter={getSentGiftsNumber}
              YGetter={getCampaignPurposeLabel}
              width={width}
              height={height}
              margin={{
                top: 20,
                right: width * 0.2,
                bottom: 0,
                left: width * 0.1,
              }}
              labelWidth={width * 0.1}
              topOffset={top}
              tooltipRender={renderTooltip}
              isLoading={isFetching}
              axisTicksFormat={{ type: TRoiChartAxisTypes.Numerical }}
              svgContainerId={svgContainerId}
            />
          )}
        </ParentSize>
      </Box>
    </>
  );
};

export default AcceptedGiftsByCampaignPurposeChart;
