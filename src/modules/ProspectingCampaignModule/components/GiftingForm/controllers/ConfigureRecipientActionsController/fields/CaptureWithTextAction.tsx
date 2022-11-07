import React, { useEffect } from 'react';
import { Box, Checkbox, Collapse, FormControlLabel, FormLabel, TextField } from '@mui/material';
import { Control, useController, UseFormResetField } from 'react-hook-form';

import { SFormControl } from '../../../../styled/Styled';
import {
  GiftingStepFields,
  RecipientActionsDataFields,
  RecipientActionsFields,
  TProspectingGiftingForm,
} from '../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export interface ICaptureWithTextActionProps {
  control: Control<TProspectingGiftingForm>;
  resetField: UseFormResetField<TProspectingGiftingForm>;
  name: RecipientActionsFields.CaptureAffidavit | RecipientActionsFields.CaptureQuestion;
  textFieldName: RecipientActionsFields.GifterAffidavit | RecipientActionsFields.GifterQuestion;
  label: string;
}

const CaptureWithTextAction = ({
  control,
  name,
  label,
  textFieldName,
  resetField,
}: ICaptureWithTextActionProps): JSX.Element => {
  const checkboxControllerName = `${GiftingStepFields.RecipientActionsData}.${RecipientActionsDataFields.RecipientActions}.${name}` as const;
  const textFieldControllerName = `${GiftingStepFields.RecipientActionsData}.${RecipientActionsDataFields.RecipientActions}.${textFieldName}` as const;

  const {
    field: { value: checkboxValue, onChange: onCheckboxChange },
  } = useController({
    control,
    name: checkboxControllerName,
  });

  const {
    field: { value: textFieldValue, onChange: onTextFieldChange },
    fieldState: { error },
  } = useController({
    control,
    name: textFieldControllerName,
  });
  const isTextFieldEmpty = !textFieldValue;

  useEffect(() => {
    if (!checkboxValue && !isTextFieldEmpty) {
      resetField(textFieldControllerName, {
        defaultValue: null,
      });
    }
  }, [checkboxValue, resetField, textFieldControllerName, isTextFieldEmpty]);

  return (
    <SFormControl error={!!error?.message}>
      <FormControlLabel
        checked={checkboxValue}
        onChange={(_, checked) => onCheckboxChange(checked)}
        control={<Checkbox name={checkboxControllerName} color="primary" />}
        label={<FormLabel>{label}</FormLabel>}
      />
      <Collapse in={checkboxValue} mountOnEnter unmountOnExit>
        <Box ml={4}>
          <TextField
            name={textFieldControllerName}
            error={!!error?.message}
            helperText={error?.message}
            multiline
            fullWidth
            variant="outlined"
            rows={4}
            value={textFieldValue}
            onChange={event => onTextFieldChange(event.target.value.trimLeft())}
          />
        </Box>
      </Collapse>
    </SFormControl>
  );
};

export default CaptureWithTextAction;
