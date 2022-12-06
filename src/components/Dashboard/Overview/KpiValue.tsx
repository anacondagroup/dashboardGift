import React, { memo, useMemo } from 'react';
import { LoadingLabel, AlyceTheme } from '@alycecom/ui';
import { Box, SxProps, Theme } from '@mui/material';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: '2.5rem',
    minHeight: '2.5rem',
  },
  title: {
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: '1rem',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color: ({ palette }: AlyceTheme) => palette.grey.main,
  },
} as const;

export interface IKpiValueProps {
  value: number | string | React.ReactElement;
  title: string;
  isLoading: boolean;
  sx?: SxProps<Theme>;
  sxTitle?: SxProps<Theme>;
}

const KpiValue = ({ value, title, isLoading, sx = [], sxTitle = [] }: IKpiValueProps) => {
  const formattedValue = useMemo(() => {
    if (isLoading) {
      return <LoadingLabel mt={2.5} width={36} height={4} />;
    }

    return <span>{value}</span>;
  }, [value, isLoading]);

  return (
    <Box sx={[styles.wrapper, ...(Array.isArray(sx) ? sx : [sx])]} data-testid={`kpi-value-${title}`}>
      <Box sx={styles.value}>{formattedValue}</Box>
      <Box sx={[styles.title, ...(Array.isArray(sxTitle) ? sxTitle : [sxTitle])]}>{title}</Box>
    </Box>
  );
};

export default memo(KpiValue);
