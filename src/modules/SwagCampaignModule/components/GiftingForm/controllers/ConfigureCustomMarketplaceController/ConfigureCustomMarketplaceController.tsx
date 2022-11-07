import React, { useCallback, useMemo } from 'react';
import { Icon, Button } from '@alycecom/ui';
import { Control, UseFormResetField, useController } from 'react-hook-form';
import { SFormLabel } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import MuiAlert from '@mui/material/Alert';
import { Box, FormControl, FormHelperText } from '@mui/material';

import CustomMarketplaceSelect from '../../../../../MarketplaceModule/components/Shared/CustomMarketplaceSelect/CustomMarketplaceSelect';
import { MarketplaceOption } from '../../../../store/swagCampaign/steps/gifting/gifting.constants';
import { makeGetCustomMarketplaceCountries } from '../../../../../MarketplaceModule/store/entities/customMarketplaces/customMarketplaces.selectors';
import {
  CustomMarketplaceDataFields,
  DefaultGiftDataFields,
  GiftingStepFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';
import { TSwagCustomMarketplaceData } from '../../../../store/swagCampaign/swagCampaign.types';
import { getDetailsData } from '../../../../store/swagCampaign/steps/details/details.selectors';

import { useGiftingCustomMarketplacePersist } from './hooks/useGiftingCustomMarketplacePersist';

export interface ISwagSelectCustomMarketplaceFormProps {
  control: Control<TSwagCampaignGiftingForm>;
  teamId: number | undefined;
  toggleConfiguration: () => void;
  resetField: UseFormResetField<TSwagCampaignGiftingForm>;
}

const styles = {
  tip: {
    backgroundColor: 'orange.main',
    fontSize: 16,
  },
  opaque: {
    color: 'grey.main',
    display: 'flex',
    alignItems: 'center',
    mt: 1,
  },
  button: {
    p: 0,
  },
} as const;

const ConfigureCustomMarketplaceController = ({
  control,
  teamId,
  toggleConfiguration,
  resetField,
}: ISwagSelectCustomMarketplaceFormProps): JSX.Element => {
  const { countryIds } = useSelector(getDetailsData) || {};

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({
    control,
    name: `${GiftingStepFields.CustomMarketPlaceData}.${CustomMarketplaceDataFields.Id}` as const,
  });

  const { field: marketplaceOptionField } = useController({
    name: GiftingStepFields.OptionMarketplace,
    control,
  });

  const { field: leadingGiftField } = useController({
    control,
    name: `${GiftingStepFields.DefaultGiftData}.${DefaultGiftDataFields.DefaultGift}` as const,
  });

  const countries = useSelector(useMemo(() => makeGetCustomMarketplaceCountries(value), [value]));
  const { save: saveCustomMarketplace, clean: cleanCustomMarketplace } = useGiftingCustomMarketplacePersist({
    resetField,
  });

  const onChangeHandler = useCallback(
    (event: number | null) => {
      leadingGiftField.onChange(null);
      onChange(event);
      marketplaceOptionField.onChange(MarketplaceOption.CustomMarketplace);
      saveCustomMarketplace({ id: event } as TSwagCustomMarketplaceData);
    },
    [marketplaceOptionField, onChange, saveCustomMarketplace, leadingGiftField],
  );

  const closeCustomMarketplaceSelection = () => {
    toggleConfiguration();
    cleanCustomMarketplace();
  };

  return (
    <Box mb={6.5}>
      <SFormLabel>Specify the Gift Marketplace for Senders</SFormLabel>
      {teamId ? (
        <Box mt={3} maxWidth="600px">
          <FormControl fullWidth error={!!error}>
            <CustomMarketplaceSelect
              disableEmptyMarketplaces
              permittedCountryIds={countryIds}
              teamId={teamId}
              value={value}
              onChange={onChangeHandler}
            />
            {!!error?.message && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
          {countries?.length > 0 && (
            <Box mt={2}>
              <MuiAlert
                icon={<Icon fontSize="inherit" icon="exclamation-circle" />}
                variant="filled"
                severity="warning"
                sx={styles.tip}
              >
                Products from this marketplace are only available for recipients located in{' '}
                <b>{countries.map(country => country.name).join(', ')}.</b>
              </MuiAlert>
            </Box>
          )}
        </Box>
      ) : (
        <Box mt={2}>
          <MuiAlert
            icon={<Icon fontSize="inherit" icon="exclamation-circle" />}
            variant="filled"
            severity="warning"
            sx={styles.tip}
          >
            Team was not found.
          </MuiAlert>
        </Box>
      )}
      <Box sx={styles.opaque}>
        Or&nbsp;
        <Button variant="text" sx={styles.button} onClick={closeCustomMarketplaceSelection}>
          manually configure Marketplace
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigureCustomMarketplaceController;
