import React, { useCallback, useState } from 'react';
import { Button } from '@alycecom/ui';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import CustomMarketplaceSelect from '../../../../../MarketplaceModule/components/Shared/CustomMarketplaceSelect/CustomMarketplaceSelect';
import { set1t1CampaignCustomMarketplaceId } from '../../../../store/campaign/giftInvites/giftInvites.actions';
import { getCampaignSettingsIsLoading } from '../../../../store/campaign/giftInvites/giftInvites.selectors';

export interface ICustomMarketplaceFormProps {
  campaignId: number;
  countryIds: number[];
  teamId: number;
  customMarketplaceId?: number | null;
}

const CustomMarketplaceForm = ({
  campaignId,
  countryIds,
  teamId,
  customMarketplaceId = null,
}: ICustomMarketplaceFormProps): JSX.Element => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getCampaignSettingsIsLoading);

  const [marketplaceId, setMarketplaceId] = useState<null | number>(customMarketplaceId);
  const isSaveButtonDisabled = isLoading || customMarketplaceId === marketplaceId;

  const handleChange = useCallback((value: number | null) => {
    setMarketplaceId(value);
  }, []);

  const handleSave = useCallback(() => {
    dispatch(set1t1CampaignCustomMarketplaceId({ campaignId, customMarketplaceId: marketplaceId }));
  }, [dispatch, marketplaceId, campaignId]);

  return (
    <>
      <Box width={1 / 3}>
        <CustomMarketplaceSelect
          value={marketplaceId}
          permittedCountryIds={countryIds}
          teamId={teamId}
          onChange={handleChange}
          disableClearable={false}
          disableEmptyMarketplaces
        />
      </Box>
      <Box mt={2.5}>
        <Button disabled={isSaveButtonDisabled} color="secondary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </>
  );
};

export default CustomMarketplaceForm;
