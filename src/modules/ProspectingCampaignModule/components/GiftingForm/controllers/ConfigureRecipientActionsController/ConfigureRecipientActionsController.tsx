import React from 'react';
import { Control, Controller, UseFormResetField } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Divider } from '@alycecom/ui';

import { SFormControl, SFormLabel } from '../../../styled/Styled';
import {
  GiftingStepFields,
  RecipientActionsDataFields,
  RecipientActionsFields,
  TProspectingGiftingForm,
} from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';

import CaptureAction from './fields/CaptureAction';
import CaptureWithTextAction from './fields/CaptureWithTextAction';

export interface IConfigureRecipientActionsControllerProps {
  control: Control<TProspectingGiftingForm>;
  resetField: UseFormResetField<TProspectingGiftingForm>;
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
    <Divider my={3} />
    <Controller
      control={control}
      name={`${GiftingStepFields.RecipientActionsData}.${RecipientActionsDataFields.Override}` as const}
      render={({ field: { value, onChange } }) => (
        <FormControlLabel
          checked={value}
          onChange={(_, checked) => onChange(checked)}
          control={<Checkbox color="primary" />}
          label="Allow team members to change the required actions on a per-gift basis"
        />
      )}
    />
  </SFormControl>
);

export default ConfigureRecipientActionsController;
