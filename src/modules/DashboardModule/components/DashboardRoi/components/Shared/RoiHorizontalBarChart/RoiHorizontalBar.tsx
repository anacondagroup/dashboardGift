import React, { useCallback, useState } from 'react';
import { animated, useChain, useSpring, useSpringRef } from 'react-spring';
import { BarRounded } from '@visx/shape';
import { Text } from '@visx/text';
import { useTheme } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { defaultMarginOfBarChart } from '@alycecom/services';

import { TGetBarLabelInChartArgs, TRoiTooltipMeta } from '../../../utils/roiTypes';

const gapBetweenLabelAndBar = 20;
const gapBetweenLabelEndAndTooltipArrow = 5;
const AnimatedBar = animated(BarRounded);
const AnimatedText = animated(Text);

type TShowTooltipArgs<T> = {
  tooltipData: T & TRoiTooltipMeta;
  tooltipLeft: number;
  tooltipTop: number;
};

interface IRoiHorizontalBarProps<T> {
  x: number;
  y: number;
  width: number;
  height: number;
  xValue: number;
  data: T;
  topOffset: number;
  leftOffset: number;
  isLoading: boolean;
  dataNotFound: boolean;
  margin: typeof defaultMarginOfBarChart;
  barsColor?: string;
  barsOnHoverColor?: string;
  isTooltipActive: boolean;
  showTooltip: (args: TShowTooltipArgs<T & TRoiTooltipMeta>) => void;
  hideTooltip: () => void;
  getBarLabel?: (args: TGetBarLabelInChartArgs) => string;
}

const RoiHorizontalBar = <T,>({
  x,
  y,
  width,
  height,
  xValue,
  data,
  topOffset,
  leftOffset,
  isLoading,
  dataNotFound = false,
  margin,
  barsColor,
  barsOnHoverColor,
  isTooltipActive = false,
  showTooltip,
  hideTooltip,
  getBarLabel,
}: IRoiHorizontalBarProps<T>): JSX.Element => {
  const { palette } = useTheme<AlyceTheme>();
  const fillColor = isTooltipActive
    ? barsOnHoverColor || palette.green.fruitSalad120
    : barsColor || palette.green.fruitSalad;

  const scaleSpringRef = useSpringRef();
  const labelSpringRef = useSpringRef();
  const labelStyles = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, ref: labelSpringRef });
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    ref: scaleSpringRef,
  });

  const [labelWidth, setLabelWidth] = useState(0);
  const measureLabelRef = useCallback((svgText: SVGSVGElement | null) => {
    if (svgText !== null) {
      const dimension = svgText.getBoundingClientRect();
      setLabelWidth(dimension.width);
    }
  }, []);

  useChain(!isLoading ? [scaleSpringRef, labelSpringRef] : []);

  return (
    <>
      <AnimatedBar
        style={
          isTooltipActive
            ? {
                filter: `drop-shadow(0px 10px 40px rgba(51, 69, 124, 0.25))`,
              }
            : undefined
        }
        radius={4}
        right
        x={x}
        y={y}
        width={scale.to(s => s * width)}
        height={height}
        fill={fillColor}
        onMouseLeave={() => {
          hideTooltip();
        }}
        onMouseOver={() => {
          showTooltip({
            tooltipData: {
              ...data,
              chart: {
                marginLeft: margin.left + leftOffset,
                marginRight: margin.right,
                barHeight: height,
                barLabelWidth: labelWidth + gapBetweenLabelAndBar + gapBetweenLabelEndAndTooltipArrow,
              },
            },
            tooltipTop: topOffset + y + margin.top,
            tooltipLeft: width,
          });
        }}
      />
      {!isLoading && !dataNotFound && (
        <AnimatedText
          x={x + width + gapBetweenLabelAndBar}
          y={y + 12}
          verticalAnchor="middle"
          style={{ ...labelStyles, fontSize: 14, fill: palette.grey.main }}
          innerRef={measureLabelRef}
        >
          {getBarLabel ? getBarLabel({ xValue }) : `${xValue} gifts`}
        </AnimatedText>
      )}
    </>
  );
};

export default RoiHorizontalBar;
