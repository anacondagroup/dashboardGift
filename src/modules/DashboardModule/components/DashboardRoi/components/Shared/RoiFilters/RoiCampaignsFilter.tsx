import React, { memo, useMemo } from 'react';
import { campaignListEntityAdapter, TCampaignSummary, useGetCampaignListQuery } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import { IMultiAutocompleteProps, MultiAutocomplete } from '@alycecom/ui';
import { AutocompleteRenderOptionState, Box, Checkbox } from '@mui/material';
import { toUnderscore } from '@alycecom/utils';

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
  renderOptions: {
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
  },
} as const;

const renderOption = (
  { className, onMouseOver: _, ...props }: React.HTMLAttributes<HTMLLIElement>,
  option: TCampaignSummary,
  { selected }: AutocompleteRenderOptionState,
) => {
  const optionLabel = option.campaignName;

  return (
    <li {...props} className={className}>
      <Checkbox
        checked={selected}
        color="primary"
        data-testid={`AlyceUI.MultiSelect.Option.${toUnderscore(optionLabel)}`}
      />
      <Box sx={styles.renderOptions} data-testid={`AlyceUI.MultiSelect.OptionLabel.${toUnderscore(optionLabel)}`}>
        {optionLabel}
      </Box>
    </li>
  );
};

const RoiCampaignsFilter = (): JSX.Element => {
  const dispatch = useDispatch();
  const selectedCampaignIds = useSelector(getRoiCurrentCampaigns);

  const { data } = useGetCampaignListQuery(undefined);
  const { selectAll } = campaignListEntityAdapter.getSelectors(
    () => data ?? campaignListEntityAdapter.getInitialState(),
  );
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
        renderOption={renderOption}
        onChange={handleCampaignsChange}
        listboxProps={{ maxVisibleRows: 4 }}
      />
    </Box>
  );
};

export default memo(RoiCampaignsFilter);
