import React from 'react';
import { MultiAutocomplete } from '@alycecom/ui';
import { Box, Theme } from '@mui/material';

const styles = {
  filter: {
    width: 290,
    paddingLeft: ({ spacing }: Theme) => spacing(3.5),
    margin: 0,
  },
} as const;

export interface IRoiDealTypesFilterProps {
  dealTypes: string[];
  dealTypesSelected: string[];
  onChange: (dealTypes: string[]) => void;
}

const RoiDealTypesFilter = ({ dealTypes, dealTypesSelected, onChange }: IRoiDealTypesFilterProps): JSX.Element => (
  <Box sx={styles.filter}>
    <MultiAutocomplete<string, true>
      label="Any Deal Type"
      name="deal-type"
      value={dealTypesSelected}
      options={dealTypes}
      listboxProps={{ maxVisibleRows: 4 }}
      multiple
      onChange={onChange}
      getOptionLabel={option => option}
    />
  </Box>
);
export default RoiDealTypesFilter;
