import React from 'react';
import { Box, TableCell, Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow/TableRow';

import noSearchResultsSvg from '../../../assets/images/NoSearchResult.svg';

const styles = {
  row: {
    height: 585,
  },
  innerContainer: {
    verticalAlign: 'top',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textWrapper: {
    width: 350,
    color: 'grey.main',
  },
  header: {
    fontWeight: 700,
    color: 'text.primary',
  },
};

interface IRoiTableNoDataProps {
  colSpan: number;
}

const RoiTableNoData = ({ colSpan }: IRoiTableNoDataProps): JSX.Element => (
  <TableRow sx={styles.row}>
    <TableCell colSpan={colSpan} sx={styles.innerContainer}>
      <Box sx={styles.content}>
        <img src={noSearchResultsSvg} alt="No result found" />
        <Box sx={styles.textWrapper}>
          <Typography sx={styles.header}>No results found</Typography>
          <Typography>Try adjusting your filters</Typography>
        </Box>
      </Box>
    </TableCell>
  </TableRow>
);

export default RoiTableNoData;
