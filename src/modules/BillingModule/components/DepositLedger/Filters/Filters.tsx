import React, { memo } from 'react';
import { Box } from '@mui/material';

import DateFilter from './DateFilter';
import TypeFilter from './TypeFilter';
import GroupsAndTeamsFilter from './GroupsAndTeamsFilter';

const styles = {
  root: {
    display: 'flex',
    width: 1,
    mb: 4,
  },
  filter: {
    mr: 2,
    minWidth: 320,
  },
} as const;

const Filters = (): JSX.Element => (
  <Box sx={styles.root}>
    <Box sx={styles.filter}>
      <GroupsAndTeamsFilter />
    </Box>
    <Box sx={styles.filter}>
      <DateFilter />
    </Box>
    <Box sx={styles.filter}>
      <TypeFilter />
    </Box>
  </Box>
);

export default memo(Filters);
