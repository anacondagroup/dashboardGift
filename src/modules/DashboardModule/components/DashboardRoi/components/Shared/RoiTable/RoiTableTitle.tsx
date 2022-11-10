import React from 'react';
import { Box, Skeleton, Theme, Typography } from '@mui/material';

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
    ml: 1,
  },
  clickableTitle: {
    color: ({ palette }: Theme) => palette.link.main,
    cursor: 'pointer',

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
    {isLoading ? (
      <Skeleton sx={styles.totalPlaceholder} />
    ) : (
      <>
        <Box sx={[styles.title, !!parentTitle && styles.clickableTitle]} onClick={() => onParentClick()}>
          {`${total} ${parentTitle || title}`}
        </Box>
        {parentTitle && <Typography sx={styles.title}>{`> ${title}`}</Typography>}
      </>
    )}
  </StyledRoiSectionTitle>
);

export default RoiTableTitle;
