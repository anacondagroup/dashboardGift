import React, { useMemo } from 'react';
import { campaignListEntityAdapter, useGetCampaignListQuery } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import { IMultiAutocompleteProps, MultiAutocomplete } from '@alycecom/ui';
import { Box } from '@mui/material';

import { setRoiFilters } from '../../../store/filters';
import { getRoiCurrentCampaigns } from '../../../store/filters/filters.selectors';

const styles = {
  filter: {
    width: 300,
  },
  toggle: {
    marginLeft: 1,
    fontSize: '14px',
  },
  button: {
    minWidth: 'auto',
    padding: 0,
    fontSize: '14px',
  },
} as const;

const RoiCampaignsFilter = (): JSX.Element => {
  const dispatch = useDispatch();
  const selectedCampaignIds = useSelector(getRoiCurrentCampaigns);

  const { selectAll } = useGetCampaignListQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      ...campaignListEntityAdapter.getSelectors(() => result?.data ?? campaignListEntityAdapter.getInitialState()),
    }),
  });

  const campaigns = useSelector(selectAll);

  const selectedCampaigns = useMemo(
    () => campaigns.filter(campaign => selectedCampaignIds.includes(campaign.campaignId)),
    [selectedCampaignIds, campaigns],
  );

  const handleCampaignsChange: IMultiAutocompleteProps<typeof campaigns[number], true>['onChange'] = newCampaigns => {
    dispatch(setRoiFilters({ campaignIds: newCampaigns.map(campaign => campaign.campaignId) }));
  };

  return (
    <Box sx={styles.filter}>
      <MultiAutocomplete<typeof campaigns[number], true>
        label="Select Campaigns"
        name="campaignsFilter"
        value={selectedCampaigns}
        options={campaigns}
        multiple
        getOptionLabel={option => option.campaignName}
        onChange={handleCampaignsChange}
        listboxProps={{ maxVisibleRows: 4 }}
      />
    </Box>
  );
};

export default RoiCampaignsFilter;
