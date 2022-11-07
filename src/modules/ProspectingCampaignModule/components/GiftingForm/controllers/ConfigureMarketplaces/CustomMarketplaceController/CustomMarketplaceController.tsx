import React from 'react';
import { Control, useController } from 'react-hook-form';
import { CampaignSettings } from '@alycecom/modules';
import { Box, FormHelperText } from '@mui/material';
import { useSelector } from 'react-redux';

import {
  CustomMarketplaceDataFields,
  GiftingStepFields,
  TProspectingGiftingForm,
} from '../../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import CustomMarketplaceSelect from '../../../../../../MarketplaceModule/components/Shared/CustomMarketplaceSelect/CustomMarketplaceSelect';
import { getDetailsData } from '../../../../../store/prospectingCampaign/steps/details/details.selectors';

import styles from './CustomMarketplaceController.styles';

export interface ICustomMarketplaceControllerProps {
  control: Control<TProspectingGiftingForm>;
}

const CustomMarketplaceController = ({ control }: ICustomMarketplaceControllerProps): JSX.Element => {
  const detailsData = useSelector(getDetailsData);
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name: `${GiftingStepFields.CustomMarketplaceData}.${CustomMarketplaceDataFields.MarketplaceId}` as const,
  });
  return (
    <Box sx={styles.root}>
      <CampaignSettings.StyledFormLabel sx={styles.label} error={!!error?.message}>
        Specify the Gift Marketplace for Senders
      </CampaignSettings.StyledFormLabel>
      {!!detailsData && (
        <>
          <CustomMarketplaceSelect
            teamId={detailsData.teamId}
            value={value}
            onChange={onChange}
            permittedCountryIds={detailsData.countryIds}
            disableEmptyMarketplaces
          />
          {!!error?.message && <FormHelperText error>{error.message}</FormHelperText>}
        </>
      )}
    </Box>
  );
};

export default CustomMarketplaceController;
