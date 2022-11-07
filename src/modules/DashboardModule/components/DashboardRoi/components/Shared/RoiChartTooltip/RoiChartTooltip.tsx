import React, { useCallback, useMemo, useState } from 'react';
import { defaultStyles, Tooltip } from '@visx/tooltip';
import { Box, Theme } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { useTheme } from '@mui/styles';

import { TRoiTooltipMeta } from '../../../utils/roiTypes';

const arrowHeight = 28;
const arrowWidth = 14;
const mainColorWithOpacity = 'rgba(51, 68, 124, 0.15)';
const backgroundColorWithLowOpacity = 'rgba(51, 68, 124, 0.02)';

const styles = {
  content: {
    display: 'flex',
    position: 'relative',
    left: 0,
    top: 0,
    fontSize: '16px',
    padding: ({ spacing }: Theme) => spacing(1.4, 2, 2, 2),
  },
  arrowStyles: {
    position: 'absolute',
    width: '0',
    height: '0',
    backgroundColor: backgroundColorWithLowOpacity,
  },
  arrowTopStyles: {
    top: '-26px',
    borderLeft: '14px solid transparent',
    borderBottom: '14px solid white',
    borderRight: '14px solid transparent',
  },
  arrowBottomStyles: {
    top: '20px',
    borderLeft: '14px solid transparent',
    borderTop: '14px solid white',
    borderRight: '14px solid transparent',
  },
  arrowLeftStyles: {
    left: '-22px',
    borderTop: '14px solid transparent',
    borderBottom: '14px solid transparent',
    borderRight: '14px solid white',
  },
  arrowRightStyles: {
    borderTop: '14px solid transparent',
    borderBottom: '14px solid transparent',
    borderLeft: '14px solid white',
  },
} as const;

interface IRoiChartTooltipProps<T, M> {
  xMax: number;
  top?: number;
  left?: number;
  data?: (T | M) & TRoiTooltipMeta;
  barType?: 'horizontal' | 'vertical';
  render?: (tooltipData: (T | M) & TRoiTooltipMeta) => React.ReactNode;
}

const RoiChartTooltip = <T, M>({
  xMax = 0,
  top = 0,
  left = 0,
  data,
  barType = 'vertical',
  render = _ => <></>,
}: IRoiChartTooltipProps<T, M>): JSX.Element => {
  const { palette: colors } = useTheme<AlyceTheme>();
  const { barWidth = 0, barHeight = 0, marginLeft = 0, marginRight = 0, barLabelWidth = 0 } = data?.chart || {};
  const tooltipContainerStyles = useMemo(
    () => ({
      display: 'flex',
      padding: 0,
      backgroundColor: colors.common.white,
      color: colors.primary.main,
      boxShadow: `0px 4px 16px ${mainColorWithOpacity}`,
      borderRadius: '4px',
    }),
    [colors],
  );

  const [tooltipWidth, setTooltipWidth] = useState(0);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const fullTooltipWidth = tooltipWidth + arrowWidth;
  const arrowRight = marginLeft + left + barWidth + fullTooltipWidth + barLabelWidth > xMax + marginRight + marginLeft;
  const arrowLeft = !arrowRight;
  const measureTooltipContentRef = useCallback((div: HTMLDivElement | null) => {
    if (div !== null) {
      const dimension = div.getBoundingClientRect();
      setTooltipWidth(dimension.width);
      setTooltipHeight(dimension.height);
    }
  }, []);
  const isTooltipSizeDefined = !!tooltipWidth && !!tooltipHeight;

  const calculateLeft = () => {
    if (!isTooltipSizeDefined) {
      return 0;
    }

    if (arrowRight) {
      return left + marginLeft - fullTooltipWidth;
    }

    if (arrowLeft) {
      if (barType === 'horizontal') {
        return left + marginLeft + barWidth + arrowWidth + barLabelWidth;
      }

      return left + marginLeft + barWidth + arrowWidth;
    }
    return 0;
  };

  const calculateTop = () => {
    if (!isTooltipSizeDefined) {
      return 0;
    }
    if (barType === 'horizontal') {
      return top - tooltipHeight / 2 + barHeight / 2;
    }
    return top - tooltipHeight / 2;
  };

  const halfHeight = (tooltipHeight || 0) * 0.5 - arrowHeight / 2;
  const sideRightArrowStyles = { top: halfHeight, right: -arrowHeight / 2 };
  const sideLeftArrowStyles = { top: halfHeight, left: -arrowHeight / 2 };
  const widthAndHeight = tooltipWidth && tooltipHeight ? { width: tooltipWidth, height: tooltipHeight } : {};

  return (
    <>
      {!!data && (
        <Tooltip
          top={calculateTop()}
          left={calculateLeft()}
          offsetLeft={0}
          offsetTop={0}
          style={{ ...defaultStyles, ...tooltipContainerStyles, ...widthAndHeight }}
        >
          <Box ref={measureTooltipContentRef} sx={styles.content}>
            {!!render && render(data)}

            <Box sx={[styles.arrowStyles, arrowLeft && styles.arrowLeftStyles, sideLeftArrowStyles]} />
            <Box sx={[styles.arrowStyles, arrowRight && styles.arrowRightStyles, sideRightArrowStyles]} />
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default RoiChartTooltip;
