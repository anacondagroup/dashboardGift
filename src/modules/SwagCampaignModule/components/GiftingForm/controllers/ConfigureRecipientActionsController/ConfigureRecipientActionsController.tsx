import React from 'react';
import { Control, UseFormResetField } from 'react-hook-form';
import { Box, FormGroup } from '@mui/material';
import { SFormControl, SFormLabel } from '@alycecom/modules';

import {
  RecipientActionsFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';

import CaptureAction from './fields/CaptureAction';
import CaptureWithTextAction from './fields/CaptureWithTextAction';

export interface IConfigureRecipientActionsControllerProps {
  control: Control<TSwagCampaignGiftingForm>;
  resetField: UseFormResetField<TSwagCampaignGiftingForm>;
}

const ConfigureRecipientActionsController = ({
  control,
  resetField,
}: IConfigureRecipientActionsControllerProps): JSX.Element => (
  <SFormControl>
    <Box mb={1.5}>
      <SFormLabel>What, if anything, do you want a recipient to do in order to redeem their gift?</SFormLabel>
    </Box>
    <FormGroup>
      <CaptureAction
        control={control}
        label="Accept a calendar invite*"
        description="* Due to anti-bribery laws: while meeting acceptance may be made obligatory, meeting attendance cannot be required"
        name={RecipientActionsFields.CaptureDate}
      />
      <CaptureAction control={control} label="Provide phone number" name={RecipientActionsFields.CapturePhone} />
      <CaptureAction control={control} label="Provide email address" name={RecipientActionsFields.CaptureEmail} />
      <CaptureWithTextAction
        control={control}
        resetField={resetField}
        name={RecipientActionsFields.CaptureQuestion}
        textFieldName={RecipientActionsFields.GifterQuestion}
        label="Answer custom questions"
      />
      <CaptureWithTextAction
        control={control}
        resetField={resetField}
        name={RecipientActionsFields.CaptureAffidavit}
        textFieldName={RecipientActionsFields.GifterAffidavit}
        label="Accept custom terms & conditions"
      />
    </FormGroup>
  </SFormControl>
);

export default ConfigureRecipientActionsController;
