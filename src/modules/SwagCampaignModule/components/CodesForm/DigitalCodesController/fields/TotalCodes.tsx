import React from 'react';
import { Control, useController } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';

import {
  TDigitalCodesFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../store/swagCampaign/steps/codes/codes.types';

export interface ITotalCodesProps {
  control: Control<TDigitalCodesFormValues>;
}

const TotalCodes = ({ control }: ITotalCodesProps): JSX.Element => {
  const name = CodesSettingsDataFields.CodesAmount;

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <ReactNumberFormat
      label={CodesSettingsLabels.TotalCodes}
      value={value}
      onChange={e => onChange(e.target.value || 0)}
      onBlur={onBlur}
      variant="outlined"
      margin="normal"
      decimalScale={0}
      allowNegative={false}
      customInput={TextField}
      error={!!error?.message}
      helperText={error?.message}
      required
      inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.DigitalCodes.TotalCodes' }}
    />
  );
};

export default TotalCodes;
