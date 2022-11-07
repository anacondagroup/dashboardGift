import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, FormGroup } from '@mui/material';

import { SFormControl, SFormLabel } from '../../../styled/Styled';
import {
  GiftActionsDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';

import GiftCheckboxAction from './fields/GiftCheckboxAction';
import GiftExpireDays from './fields/GiftExpireDays';

export interface IConfigureGiftActionsControllerProps {
  control: Control<TProspectingGiftingForm>;
}

const ConfigureGiftActionsController = ({ control }: IConfigureGiftActionsControllerProps): JSX.Element => {
  const {
    field: { value: isDonationEnabled },
  } = useController({
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.IsDonationEnabled}` as const,
    control,
  });

  return (
    <>
      <Box mb={7}>
        <SFormControl>
          <Box mb={1.5}>
            <SFormLabel>Allow Recipients to...</SFormLabel>
          </Box>
          <FormGroup>
            <GiftCheckboxAction
              control={control}
              name={GiftActionsDataFields.Accept}
              label="Accept gift"
              disabled
              lock
              disabledTooltip="What’s the point in sending a gift if they can’t accept it?"
            />
            <GiftCheckboxAction
              control={control}
              name={GiftActionsDataFields.Exchange}
              label="Exchange their gift for something else from the Gift Marketplace above"
            />
            <GiftCheckboxAction
              control={control}
              name={GiftActionsDataFields.Donate}
              label="Donate the value of the gift to the charity of their choice"
              disabled={!isDonationEnabled}
              checked={isDonationEnabled ? undefined : false}
            />
          </FormGroup>
        </SFormControl>
      </Box>
      <Box>
        <SFormControl>
          <Box mb={1.5}>
            <SFormLabel>Expire gift invitations after…</SFormLabel>
          </Box>
          <Box width={204}>
            <GiftExpireDays control={control} />
          </Box>
        </SFormControl>
      </Box>
    </>
  );
};

export default ConfigureGiftActionsController;
