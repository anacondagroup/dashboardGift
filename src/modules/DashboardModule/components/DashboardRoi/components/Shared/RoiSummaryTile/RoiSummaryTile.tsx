import React from 'react';
import { Box, Paper, Skeleton, Theme } from '@mui/material';
import { useSpring, animated } from 'react-spring';

import { toFormattedPrice } from '../../../utils';
import InfoIconWithTooltip from '../InfoIconWithTooltip/InfoIconWithTooltip';

const styles = {
  paper: ({ breakpoints }: Theme) => ({
    maxWidth: 340,
    width: '100%',
    minWidth: 220,
    padding: ({ spacing }: Theme) => spacing(2.5, 5),
    marginRight: ({ spacing }: Theme) => spacing(2.5),
    marginLeft: ({ spacing }: Theme) => spacing(2.5),

    '&:first-of-type': {
      marginLeft: 0,
    },

    '&:last-of-type': {
      marginRight: 0,
    },

    [breakpoints.down(breakpoints.values.lg)]: {
      padding: ({ spacing }: Theme) => spacing(1.5, 2),
      marginRight: ({ spacing }: Theme) => spacing(2),
      marginLeft: ({ spacing }: Theme) => spacing(2),
      maxWidth: 260,
      minWidth: 140,
    },
  }),
  value: ({ breakpoints }: Theme) => ({
    fontWeight: 700,
    fontSize: '48px',
    lineHeight: '56px',
    marginBottom: 1,

    [breakpoints.down(breakpoints.values.lg)]: {
      fontSize: '36px',
      lineHeight: '46px',
    },
  }),
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    height: 56,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginBottom: 3,
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

interface IRoiSummaryTileProps {
  value?: number;
  label: string;
  isLoading?: boolean;
  color?: string;
  tooltipText?: string;
  formatter?: (value: number) => string;
}

const RoiSummaryTile = ({
  label,
  value = 0,
  isLoading = false,
  color,
  tooltipText,
  formatter = v => toFormattedPrice(v, '0a'),
}: IRoiSummaryTileProps): JSX.Element => {
  const { animatedValue } = useSpring({
    reset: true,
    delay: 200,
    from: { animatedValue: 0 },
    animatedValue: value,
  });
  return (
    <Paper elevation={3} sx={styles.paper}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {isLoading && (
          <Box sx={styles.placeholder}>
            <Skeleton variant="text" width={160} height={8} data-testid={`RoiSummaryTile.${label}.loader`} />
          </Box>
        )}
        {!isLoading && (
          <Box sx={theme => ({ ...styles.value(theme), color: value && color ? color : 'text.primary' })}>
            <animated.div>{animatedValue.to(formatter)}</animated.div>
          </Box>
        )}
        <Box sx={styles.label}>
          {label}
          {tooltipText && <InfoIconWithTooltip text={tooltipText} />}
        </Box>
      </Box>
    </Paper>
  );
};

export default RoiSummaryTile;
