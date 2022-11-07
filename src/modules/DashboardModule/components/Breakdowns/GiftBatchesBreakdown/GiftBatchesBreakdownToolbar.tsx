import React, { memo } from 'react';
import { SearchField } from '@alycecom/ui';
import { Box, Grid } from '@mui/material';

const styles = {
  searchField: {
    width: '100%',
  },
} as const;

export interface IGiftBatchesBreakdownToolbarProps {
  search: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const GiftBatchesBreakdownToolbar = ({ onSearch, placeholder, search }: IGiftBatchesBreakdownToolbarProps) => (
  <Grid container direction="row" wrap="nowrap">
    <Box sx={styles.searchField}>
      <SearchField placeholder={placeholder} value={search} onChange={onSearch} />
    </Box>
  </Grid>
);

export default memo(GiftBatchesBreakdownToolbar);
