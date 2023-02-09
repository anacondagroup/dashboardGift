import React, { useCallback, useMemo } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { useTooltip } from '@visx/tooltip';
import { GridRows } from '@visx/grid';
import { Box, Typography } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { useTheme } from '@mui/styles';
import { LegendOrdinal } from '@visx/legend';
import { animated, useChain, useSpring, useSpringRef } from 'react-spring';

import { NotFoundMessage } from '../NotFoundMessage/NotFoundMessage';
import { RoiChartTooltip } from '../RoiChartTooltip';
import { TRoiTooltipMeta } from '../../../utils/roiTypes';

const styles = {
  container: { position: 'relative' },
  loaderContainer: { position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' },
  loader: {
    alignSelf: 'center',
    color: 'grey.chambray50',
  },
  legend: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '14px',
    color: 'grey.main',
  },
} as const;

const defaultMargin = {
  top: 0,
  right: 0,
  bottom: 50,
  left: 50,
};

interface IRoiHorizontalBarChartProps<T, M> {
  data: T[];
  keys: string[];
  barStackData?: M[];
  XGetter: (d: T | M) => string;
  YGetter: (d: T) => number;
  axisLeftLabelFormat?: (value: number) => string;
  axisBottomLabelFormat?: (value: string) => string;
  isLoading: boolean;
  width?: number;
  height?: number;
  margin?: typeof defaultMargin;
  tooltipRender?: (tooltipData: T | M) => React.ReactNode;
}

const RoiInfluencedARRBarChart = <T, M extends object>({
  data,
  keys,
  barStackData,
  XGetter,
  YGetter,
  isLoading,
  width = 1100,
  height = 350,
  margin = defaultMargin,
  axisLeftLabelFormat,
  axisBottomLabelFormat,
  tooltipRender,
}: IRoiHorizontalBarChartProps<T, M>): JSX.Element => {
  const { palette: colors } = useTheme<AlyceTheme>();
  const { tooltipOpen, tooltipTop, tooltipLeft, tooltipData, showTooltip, hideTooltip } = useTooltip<
    (T | M) & TRoiTooltipMeta
  >();

  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  const minDomainValue = 1;
  const maxYValueInData = Math.max(...data.map(YGetter), 0);
  const dataNotFound = maxYValueInData === 0;
  const dealTypesLength = keys.length;

  const scaleSpringRef = useSpringRef();
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    ref: scaleSpringRef,
  });

  useChain(!isLoading ? [scaleSpringRef] : []);

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        domain: data.map(XGetter),
        padding: 0.5,
      }),
    [xMax, data, XGetter],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, yMax],
        domain: [Math.max(maxYValueInData, minDomainValue), 0],
        nice: true,
      }),
    [yMax, maxYValueInData],
  );

  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [
      colors.primary.main,
      colors.green.mountainMeadowDark,
      colors.yellow.sunflower,
      colors.orange.main,
      colors.teal.main,
      colors.secondary.dark,
      colors.green.fruitSalad80,
      colors.brown.main,
      colors.red.light,
      colors.primary.superLight,
    ].slice(0, dealTypesLength),
  });

  const LoaderSpinner = useCallback(
    () => (
      <Box height={0} top={-(height / 1.4)} sx={styles.loaderContainer}>
        <Typography sx={styles.loader}>Loading data...</Typography>
      </Box>
    ),
    [height],
  );

  return (
    <Box sx={styles.container}>
      <svg width="100%" height={height} fill={colors.common.white}>
        <rect x={0} y={0} width="100%" height={height} fill="url(#teal)" rx={14} />
        <Group top={margin.top} left={margin.left}>
          <GridRows scale={yScale} height={yMax} width={xMax} stroke={colors.grey.mediumLight} numTicks={3} />
          <BarStack<M | T, string>
            data={barStackData ?? data}
            keys={keys}
            x={XGetter}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {barStacks =>
              barStacks.map((barStack, barStackIndex) =>
                barStack.bars.map((bar, barIndex) => {
                  const isLastKeyInStack = barStackIndex + 1 >= barStacks.length;
                  const shouldBeRounded = isLastKeyInStack
                    ? !!bar.height
                    : !barStacks
                        .slice(barStackIndex + 1)
                        .some(barStackArray => barStackArray.bars[barIndex].height > 0);
                  const roundedHeight = Math.min(4, bar.height * 0.5);
                  const barKeyString = `bar-stack-${barStack.index}-${bar.index}`;

                  return (
                    <React.Fragment key={barKeyString}>
                      <defs>
                        <clipPath id={barKeyString}>
                          <rect
                            x={bar.x}
                            y={bar.y}
                            width={bar.width}
                            height={bar.height + roundedHeight}
                            rx={roundedHeight}
                          />
                        </clipPath>
                      </defs>
                      <animated.rect
                        x={bar.x}
                        y={bar.y}
                        height={scale.to(s => s * bar.height)}
                        width={bar.width}
                        fill={bar.color}
                        clipPath={shouldBeRounded ? `url(#${barKeyString})` : undefined}
                        onMouseLeave={() => {
                          hideTooltip();
                        }}
                        onMouseOver={() => {
                          const yOfLastBarInSameStack = barStacks[barStacks.length - 1]?.bars[barIndex].y;

                          return showTooltip({
                            tooltipData: {
                              ...bar.bar.data,
                              chart: {
                                barWidth: bar.width,
                                marginLeft: margin.left,
                              },
                            },
                            tooltipTop: yOfLastBarInSameStack,
                            tooltipLeft: bar.x,
                          });
                        }}
                      />
                    </React.Fragment>
                  );
                }),
              )
            }
          </BarStack>

          <AxisBottom
            scale={xScale}
            top={yMax}
            hideTicks
            hideZero
            stroke={colors.grey.mediumLight}
            tickLabelProps={() => ({
              fill: colors.grey.main,
              fontWeight: '400',
              fontSize: '14px',
              textAnchor: 'middle',
            })}
            strokeWidth={2}
            tickFormat={axisBottomLabelFormat ? val => axisBottomLabelFormat(val.valueOf()) : undefined}
          />
          <AxisLeft
            tickFormat={axisLeftLabelFormat ? val => axisLeftLabelFormat(val.valueOf()) : undefined}
            hideAxisLine
            hideTicks
            scale={yScale}
            numTicks={3}
            tickLabelProps={() => ({
              fill: colors.grey.main,
              fontWeight: '400',
              fontSize: '14px',
              textAnchor: 'end',
            })}
          />
        </Group>
      </svg>

      <Box top={height - 10} width="100%" sx={styles.legend}>
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          itemDirection="row"
          itemMargin={`0px ${xMax / (dealTypesLength * 9)}px`}
          shapeHeight={24}
          shapeWidth={24}
          shapeStyle={_ => ({
            borderRadius: '4px',
          })}
        />
      </Box>

      {isLoading && <LoaderSpinner />}

      {dataNotFound && !isLoading && <NotFoundMessage height={0} top={-height - 40} />}
      {tooltipOpen && tooltipRender && (
        <RoiChartTooltip<T, M>
          xMax={xMax}
          top={tooltipTop}
          left={tooltipLeft}
          data={tooltipData}
          barType="vertical"
          render={tooltipRender}
        />
      )}
    </Box>
  );
};

export default RoiInfluencedARRBarChart;
