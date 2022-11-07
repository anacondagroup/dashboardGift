import React from 'react';
import { Box } from '@mui/material';
import { TRoiInfluencedByOpportunityStage, useGetSalesforceInfluencedPipelineQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';

import { RoiHorizontalBarChartWrapper } from '../../RoiHorizontalBarChartWrapper';
import { TGetBarLabelInChartArgs, TRoiChartAxisTypes } from '../../../../utils/roiTypes';
import { NumberFormattingOptions, toFormattedPrice } from '../../../../utils';
import { StyledRoiSectionTitle } from '../../index';
import { getRoiFilters } from '../../../../store/filters/filters.selectors';
import { RoiTooltipRow } from '../../RoiChartTooltip';

import styles from './PipelineInfluencedByOpportunityChart.styles';

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
      <Box>
        <StyledRoiSectionTitle sx={styles.title}>Pipeline Influenced by Opportunity Stage</StyledRoiSectionTitle>
      </Box>
      <Box sx={(styles.container, { height: relativeHeight })}>
        <RoiHorizontalBarChartWrapper
          data={influencedByOpportunityStageData}
          XGetter={getTotal}
          YGetter={getLabel}
          isLoading={isFetching}
          getBarLabel={({ xValue }: TGetBarLabelInChartArgs) => `${toFormattedPrice(xValue).toUpperCase()} ARR`}
          axisTicksFormat={{ type: TRoiChartAxisTypes.Currency }}
          tooltipRender={renderTooltip}
        />
      </Box>
    </>
  );
};

export default PipelineInfluencedByOpportunityChart;
