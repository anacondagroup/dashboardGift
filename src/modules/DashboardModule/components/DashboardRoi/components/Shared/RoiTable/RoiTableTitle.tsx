import React from 'react';
import { Box, Skeleton } from '@mui/material';

import { StyledRoiSectionTitle } from '../Styled';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  tableHeader: {
    pb: 2,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '24px',
    ml: 1,
  },
  totalPlaceholder: {
    display: 'inline-block',
    mt: 1.8,
    mb: 1.8,
    width: 300,
    height: 8,
  },
} as const;

export interface IRoiTableTitleProps {
  title: string;
  total?: number;
  isLoading: boolean;
  children?: React.ReactElement;
}

const RoiTableTitle = ({ title, total, isLoading, children }: IRoiTableTitleProps): JSX.Element => (
  <StyledRoiSectionTitle sx={styles.tableHeader}>
    <Box sx={styles.wrapper}>
      {isLoading ? <Skeleton sx={styles.totalPlaceholder} /> : <Box sx={styles.title}>{`${total} ${title}`}</Box>}
      {children}
    </Box>
  </StyledRoiSectionTitle>
);

export default RoiTableTitle;
