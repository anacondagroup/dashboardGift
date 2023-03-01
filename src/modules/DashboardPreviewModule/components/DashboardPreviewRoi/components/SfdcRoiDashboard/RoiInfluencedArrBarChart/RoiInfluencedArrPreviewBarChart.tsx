import React, { useMemo } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Box } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { useTheme } from '@mui/styles';
import { LegendOrdinal } from '@visx/legend';

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
  width?: number;
  height?: number;
  margin?: typeof defaultMargin;
}

const RoiInfluencedARRPreviewBarChart = <T, M extends object>({
  data,
  keys,
  barStackData,
  XGetter,
  YGetter,
  width = 1100,
  height = 350,
  margin = defaultMargin,
  axisLeftLabelFormat,
  axisBottomLabelFormat,
}: IRoiHorizontalBarChartProps<T, M>): JSX.Element => {
  const { palette: colors } = useTheme<AlyceTheme>();
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  const minDomainValue = 1;
  const maxYValueInData = Math.max(...data.map(YGetter), 0);
  const dealTypesLength = keys.length;

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
              barStacks.map(barStack =>
                barStack.bars.map(bar => {
                  const roundedHeight = Math.min(4, bar.height * 0.5);
                  const barKeyString = `bar-stack-${barStack.index}-${bar.index}`;
                  return (
                    <rect
                      key={barKeyString}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height + roundedHeight}
                      rx={roundedHeight}
                      fill={bar.color}
                    />
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
    </Box>
  );
};

export default RoiInfluencedARRPreviewBarChart;
