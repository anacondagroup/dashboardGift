import React from 'react';
import { Control } from 'react-hook-form';
import { Box, FormGroup } from '@mui/material';
import { SFormControl, SFormLabel } from '@alycecom/modules';

import {
  GiftActionsDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';

import GiftCheckboxAction from './fields/GiftCheckboxAction';

export interface IConfigureGiftActionsControllerProps {
  control: Control<TSwagCampaignGiftingForm>;
}

const ConfigureGiftActionsController = ({ control }: IConfigureGiftActionsControllerProps): JSX.Element => (
  <Box>
    <SFormControl>
      <Box>
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
        />
      </FormGroup>
    </SFormControl>
  </Box>
);

export default ConfigureGiftActionsController;
