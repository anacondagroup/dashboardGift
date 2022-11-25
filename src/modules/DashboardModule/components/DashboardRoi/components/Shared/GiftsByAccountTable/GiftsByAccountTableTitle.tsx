import React from 'react';
import { Box, Skeleton, Theme } from '@mui/material';

import { StyledRoiSectionTitle } from '../Styled';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  tableHeader: {
    pt: 0.8,
    pb: 2,
    fontSize: '24px',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    ml: 1,
  },
  clickableTitle: {
    color: ({ palette }: Theme) => palette.link.main,
    cursor: 'pointer',
    mr: 1,

    '&:hover': {
      textDecoration: 'underline',
    },
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
  total: number;
  parentTitle: string;
  isLoading: boolean;
  onParentClick: () => void;
}

const GiftsByAccountTableTitle = ({
  title,
  total,
  parentTitle,
  isLoading,
  onParentClick,
}: IRoiTableTitleProps): JSX.Element => (
  <StyledRoiSectionTitle sx={styles.tableHeader}>
    <Box sx={styles.wrapper}>
      {isLoading ? (
        <Skeleton sx={styles.totalPlaceholder} />
      ) : (
        <Box sx={styles.breadcrumbs}>
          <Box sx={[styles.title, styles.clickableTitle]} onClick={() => onParentClick()}>
            {`${total} ${parentTitle}`}
          </Box>
          <Box sx={styles.title}>{`> ${title}`}</Box>
        </Box>
      )}
    </Box>
  </StyledRoiSectionTitle>
);

export default GiftsByAccountTableTitle;
