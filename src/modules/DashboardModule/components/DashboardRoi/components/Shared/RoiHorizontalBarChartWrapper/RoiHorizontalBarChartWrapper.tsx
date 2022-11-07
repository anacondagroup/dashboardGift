import React from 'react';
import { ParentSize } from '@visx/responsive';

import { RoiHorizontalBarChart } from '../RoiHorizontalBarChart';
import { TAxisTicksFormat, TGetBarLabelInChartArgs } from '../../../utils/roiTypes';

interface IRoiHorizontalBarChartWrapperProps<T> {
  data: T[];
  XGetter: (d: T) => number;
  YGetter: (d: T) => string;
  isLoading: boolean;
  axisTicksFormat: TAxisTicksFormat;
  width?: number;
  height?: number;
  barsColor?: string;
  barsOnHoverColor?: string;
  topOffset?: number;
  tooltipRender?: (tooltipData: T | Partial<T>) => React.ReactNode;
  getBarLabel?: (args: TGetBarLabelInChartArgs) => string;
}

const RoiHorizontalBarChartWrapper = <T extends object>({
  data,
  XGetter,
  YGetter,
  isLoading,
  axisTicksFormat,
  width,
  height,
  barsColor,
  barsOnHoverColor,
  topOffset = 0,
  tooltipRender,
  getBarLabel,
}: IRoiHorizontalBarChartWrapperProps<T>): JSX.Element => {
  const relativeMargin = width ? width * 0.1 : undefined;
  const marginRight = width ? width * 0.2 : 0;

  return (
    <ParentSize>
      {parent => (
        <RoiHorizontalBarChart
          data={data}
          XGetter={XGetter}
          YGetter={YGetter}
          width={width || parent.width}
          height={height || parent.height}
          margin={{
            top: 0,
            right: marginRight || parent.width * 0.2,
            bottom: 0,
            left: relativeMargin || parent.width * 0.1,
          }}
          labelWidth={relativeMargin || parent.width * 0.1}
          topOffset={topOffset || parent.top}
          tooltipRender={tooltipRender}
          isLoading={isLoading}
          barsColor={barsColor}
          barsOnHoverColor={barsOnHoverColor}
          getBarLabel={getBarLabel}
          axisTicksFormat={axisTicksFormat}
        />
      )}
    </ParentSize>
  );
};

export default RoiHorizontalBarChartWrapper;
