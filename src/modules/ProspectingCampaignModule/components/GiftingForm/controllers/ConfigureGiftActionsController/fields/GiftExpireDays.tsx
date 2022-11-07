import React from 'react';
import { Control, useController } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

import { GiftExpireOption } from '../../../../../store/prospectingCampaign/steps/gifting/gifting.constants';
import {
  GiftActionsDataFields,
  GiftingStepFields,
  TProspectingGiftingForm,
} from '../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export interface IGiftExpireDaysProps {
  control: Control<TProspectingGiftingForm>;
}

const GiftExpireDays = ({ control }: IGiftExpireDaysProps): JSX.Element => {
  const name = `${GiftingStepFields.GiftActionsData}.${GiftActionsDataFields.ExpireInSeconds}` as const;
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <FormControl error={!!error?.message} variant="outlined" fullWidth>
      <InputLabel id={`prospecting.${name}.label`}>Total Days</InputLabel>
      <Select
        labelId={`prospecting.${name}.label`}
        label="Total Days"
        value={value}
        onChange={event => onChange(event.target.value as number)}
      >
        {Object.entries(GiftExpireOption).map(([days, seconds]) => (
          <MenuItem key={days} value={seconds}>
            {days} Days
          </MenuItem>
        ))}
      </Select>
      {!!error?.message && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
};

export default GiftExpireDays;
