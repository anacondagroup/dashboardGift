import React, { useCallback, useMemo } from 'react';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { useTooltip } from '@visx/tooltip';
import { Box, CircularProgress } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { useTheme } from '@mui/styles';
import { defaultMarginOfBarChart } from '@alycecom/services';

import { NotFoundMessage } from '../NotFoundMessage/NotFoundMessage';
import { RoiChartTooltip } from '../RoiChartTooltip';
import {
  TAxisTicksFormat,
  TGetBarLabelInChartArgs,
  TRoiChartAxisTypes,
  TRoiTooltipMeta,
} from '../../../utils/roiTypes';
import { NumberFormattingOptions, toFormattedPrice } from '../../../utils';

import RoiHorizontalBar from './RoiHorizontalBar';

const dataNotFoundHeight = 272;
const minDomainValue = 1;

interface IRoiHorizontalBarChartProps<T> {
  data: T[];
  XGetter: (d: T) => number;
  YGetter: (d: T) => string;
  isLoading: boolean;
  axisTicksFormat: TAxisTicksFormat;
  width?: number;
  height?: number;
  margin?: typeof defaultMarginOfBarChart;
  labelWidth?: number;
  barsColor?: string;
  barsOnHoverColor?: string;
  topOffset?: number;
  tooltipRender?: (tooltipData: T | Partial<T>) => React.ReactNode;
  getBarLabel?: (args: TGetBarLabelInChartArgs) => string;
}

const RoiHorizontalBarChart = <T extends object>({
  data,
  XGetter,
  YGetter,
  isLoading,
  axisTicksFormat,
  width = 1100,
  height = 1020,
  margin = defaultMarginOfBarChart,
  labelWidth = 220,
  barsColor,
  barsOnHoverColor,
  topOffset = 0,
  tooltipRender,
  getBarLabel,
}: IRoiHorizontalBarChartProps<T>): JSX.Element => {
  const { palette: colors } = useTheme<AlyceTheme>();
  const { tooltipOpen, tooltipTop, tooltipLeft, tooltipData, showTooltip, hideTooltip } = useTooltip<
    T & TRoiTooltipMeta
  >();

  const xMax = Math.max(width - labelWidth - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  const maxXValueInData = Math.max(...data.map(XGetter), 0);
  const dataNotFound = maxXValueInData === 0;

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax],
        domain: [0, Math.max(maxXValueInData, minDomainValue)],
        round: true,
      }),
    [xMax, maxXValueInData],
  );

  const yScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, yMax],
        domain: data.map(YGetter),
        padding: 0.6,
      }),
    [yMax, data, YGetter],
  );

  const LoaderSpinner = useCallback(
    () => (
      <Box position="relative" height={0} display="flex" flexDirection="column" width="100%" top={-(height / 1.6)}>
        <CircularProgress sx={{ alignSelf: 'center' }} />
      </Box>
    ),
    [height],
  );

  const topAxisTicksFormat = useCallback(
    (labelValue: number): string => {
      switch (axisTicksFormat.type) {
        case TRoiChartAxisTypes.Numerical:
          return labelValue.toString();
        case TRoiChartAxisTypes.Currency:
          return toFormattedPrice(labelValue, NumberFormattingOptions.Shortest).toLocaleUpperCase();
        default:
          return labelValue.toString();
      }
    },
    [axisTicksFormat],
  );

  return (
    <Box position="relative">
      <svg width="100%" height={height + 10}>
        <rect x={0} y={0} width="100%" height={height + 10} fill="url(#teal)" rx={14} />
        <Group top={margin.top} left={margin.left + labelWidth} style={{ transformOrigin: 'bottom center' }}>
          <GridColumns
            top={20}
            scale={xScale}
            height={yMax - 20}
            width={xMax}
            stroke={colors.grey.mediumLight}
            numTicks={6}
          />

          <Group>
            {data.map(d => {
              const yAxisValue = YGetter(d);
              const xAxisValue = XGetter(d);
              const barWidth = xScale(xAxisValue);
              const barHeight = yScale.bandwidth();
              const barX = xScale(0);
              const barY = yScale(yAxisValue) || 0;
              const isTooltipActive = !!tooltipData && YGetter(tooltipData) === yAxisValue;

              return (
                <RoiHorizontalBar
                  key={yAxisValue}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  xValue={xAxisValue}
                  data={d}
                  topOffset={topOffset}
                  leftOffset={labelWidth}
                  margin={margin}
                  isLoading={isLoading}
                  dataNotFound={dataNotFound}
                  barsColor={barsColor}
                  barsOnHoverColor={barsOnHoverColor}
                  isTooltipActive={isTooltipActive}
                  showTooltip={showTooltip}
                  hideTooltip={hideTooltip}
                  getBarLabel={getBarLabel}
                />
              );
            })}
          </Group>

          <AxisBottom
            scale={xScale}
            hideAxisLine
            hideTicks
            hideZero
            numTicks={!isLoading && !dataNotFound ? 6 : 0}
            tickFormat={labelValue => topAxisTicksFormat(labelValue.valueOf())}
            tickLabelProps={() => ({
              fontSize: 14,
              fill: colors.grey.main,
              dx: '-0.8em',
              dy: '-0.85em',
            })}
          />

          <AxisLeft
            hideAxisLine
            hideTicks
            scale={yScale}
            stroke={colors.teal.main}
            tickLength={20}
            tickFormat={v => v}
            tickLabelProps={() => ({
              width: labelWidth,
              fontSize: 16,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
        </Group>
      </svg>

      {tooltipOpen && tooltipRender && (
        <RoiChartTooltip<T, Partial<T>>
          xMax={xMax}
          top={tooltipTop}
          left={tooltipLeft}
          data={tooltipData}
          barType="horizontal"
          render={tooltipRender}
        />
      )}

      {isLoading && <LoaderSpinner />}
      {dataNotFound && !isLoading && (
        <NotFoundMessage height={0} top={-Math.min(yMax / 2 + dataNotFoundHeight, yMax)} />
      )}
    </Box>
  );
};

export default RoiHorizontalBarChart;
