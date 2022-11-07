import { Box } from '@mui/material';
import React, { memo, useCallback } from 'react';
import { TRoiTableFilters } from '@alycecom/services';

import RoiTableSearch, { IRoiTableSearchProps } from './RoiTableSearch';
import RoiCampaignPurposesFilter, { IRoiCampaignPurposesFilterProps } from './RoiCampaignPurposesFilter';

export type TRoiTableToolbarControls = {
  search: boolean;
  campaignPurpose: boolean;
};

export interface IRoiTableToolsProps<BreakdownItem>
  extends Pick<IRoiTableSearchProps, 'placeholder' | 'debounce'>,
    Pick<TRoiTableFilters<BreakdownItem>, 'search' | 'campaignPurposes'> {
  controls?: TRoiTableToolbarControls;
  onFiltersChange: (props: Pick<TRoiTableFilters<BreakdownItem>, 'search' | 'campaignPurposes'>) => void;
}

const RoiTableTools = <BreakdownItem,>({
  controls: { search, campaignPurpose } = { search: true, campaignPurpose: true },
  onFiltersChange,
  ...searchFieldProps
}: IRoiTableToolsProps<BreakdownItem>): JSX.Element => {
  const handleSearchChange = useCallback<IRoiTableSearchProps['onChange']>(
    newSearch => {
      onFiltersChange({ search: newSearch });
    },
    [onFiltersChange],
  );

  const handleCampaignPurposeChange = useCallback<IRoiCampaignPurposesFilterProps['onChange']>(
    newCampaignPurposes => {
      onFiltersChange({
        campaignPurposes: newCampaignPurposes,
      });
    },
    [onFiltersChange],
  );

  return (
    <Box my={1} display="flex" alignItems="center" justifyContent="space-between">
      {search && <RoiTableSearch onChange={handleSearchChange} {...searchFieldProps} />}
      {campaignPurpose && <RoiCampaignPurposesFilter onChange={handleCampaignPurposeChange} />}
    </Box>
  );
};

export default memo(RoiTableTools);
