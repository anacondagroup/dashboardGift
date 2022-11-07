import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

import { StyledRoiSectionTitle } from '../Styled';

const styles = {
  tableHeader: {
    paddingBottom: 2,
    fontSize: '24px',
  },
  title: {
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  clickableTitle: {
    color: 'link.main',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  totalPlaceholder: {
    display: 'inline-block',
    mr: 1,
    width: 30,
    height: 8,
  },
} as const;

interface IRoiTableTitleProps {
  title: string;
  total?: number;
  parentTitle?: string;
  isLoading: boolean;
  onParentClick?: () => void;
}

const RoiTableTitle = ({
  title,
  total,
  parentTitle,
  isLoading,
  onParentClick = () => {},
}: IRoiTableTitleProps): JSX.Element => (
  <StyledRoiSectionTitle sx={styles.tableHeader}>
    <Box sx={[styles.title, !!parentTitle && styles.clickableTitle]} onClick={() => onParentClick()}>
      {isLoading ? <Skeleton sx={styles.totalPlaceholder} /> : total}&nbsp;
      {parentTitle || title}
    </Box>
    {parentTitle && (
      <Typography sx={styles.title}>
        &nbsp; {'>'} &nbsp;{title}
      </Typography>
    )}
  </StyledRoiSectionTitle>
);

export default RoiTableTitle;
