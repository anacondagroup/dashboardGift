import React from 'react';
import { Box } from '@mui/material';
import { TRoiInfluencedByOpportunityStage, useGetSalesforceInfluencedPipelineQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { ParentSize } from '@visx/responsive';

import { RoiHorizontalBarChart } from '../../RoiHorizontalBarChart';
import { TGetBarLabelInChartArgs, TRoiChartAxisTypes } from '../../../../utils/roiTypes';
import { NumberFormattingOptions, toFormattedPrice } from '../../../../utils';
import { StyledRoiSectionTitle } from '../../index';
import { getRoiFilters } from '../../../../store/filters/filters.selectors';
import { RoiTooltipRow } from '../../RoiChartTooltip';
import { RoiDownloadImage } from '../../RoiDownloadImage/RoiDownloadImage';

import styles from './PipelineInfluencedByOpportunityChart.styles';

const CHART_TITLE = 'Pipeline Influenced by Opportunity Stage';
const svgContainerId = 'pipeline-influenced-svg';
const getLabel = (d: TRoiInfluencedByOpportunityStage): string => d.opportunityStage || '';
const getTotal = (d: TRoiInfluencedByOpportunityStage) => d.amount;

const PipelineInfluencedByOpportunityChart = (): JSX.Element => {
  const globalFilters = useSelector(getRoiFilters);
  const { data, isFetching } = useGetSalesforceInfluencedPipelineQuery(globalFilters);
  const influencedByOpportunityStageData = !isFetching && !!data?.data ? data.data : [];
  const relativeHeight = Math.max(77 * influencedByOpportunityStageData.length, 385);

  const renderTooltip = (tooltipData: TRoiInfluencedByOpportunityStage | Partial<TRoiInfluencedByOpportunityStage>) => (
    <Box display="flex" flexDirection="column">
      <RoiTooltipRow label="Total Opportunities" value={tooltipData.totalOpportunities?.toFixed(0)} />
      <RoiTooltipRow
        label="Median Opp. Size"
        value={`${toFormattedPrice(Number(tooltipData.costPerOpportunity), NumberFormattingOptions.Shortest)}`}
      />
    </Box>
  );

  return (
    <>
      <Box sx={styles.titleContainer}>
        <StyledRoiSectionTitle sx={styles.title}>{CHART_TITLE}</StyledRoiSectionTitle>
        <RoiDownloadImage svgContainerId={svgContainerId} imageTitle={CHART_TITLE} />
      </Box>
      <Box sx={(styles.container, { height: relativeHeight })}>
        <ParentSize>
          {({ width, height, top }) => (
            <RoiHorizontalBarChart
              data={influencedByOpportunityStageData}
              XGetter={getTotal}
              YGetter={getLabel}
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
              getBarLabel={({ xValue }: TGetBarLabelInChartArgs) => `${toFormattedPrice(xValue).toUpperCase()} ARR`}
              axisTicksFormat={{ type: TRoiChartAxisTypes.Currency }}
              svgContainerId={svgContainerId}
            />
          )}
        </ParentSize>
      </Box>
    </>
  );
};

export default PipelineInfluencedByOpportunityChart;
