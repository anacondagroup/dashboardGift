import React, { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterMoment from '@mui/lab/AdapterMoment';
import moment, { Moment } from 'moment';

import { minValidDateForCodes } from '../../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IExpirationDateProps {
  control: Control<TPhysicalCardsFormValues>;
}

const ExpirationDate = ({ control }: IExpirationDateProps): JSX.Element => {
  const name = CodesSettingsDataFields.CodesExpirationDate;

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const codesExpirationDate = useMemo(() => (value ? moment(value) : moment(minValidDateForCodes)), [value]);

  const onExpirationChangeDate = useCallback(
    (date: Moment) => {
      onChange(date);
    },
    [onChange],
  );

  return (
    <>
      <Box>When should the cards expire?</Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          inputFormat={`[${codesExpirationDate.fromNow(true)}] (dddd, LL`}
          disablePast
          mask=""
          value={codesExpirationDate}
          onChange={date => onExpirationChangeDate(moment(date))}
          minDate={moment(minValidDateForCodes)}
          renderInput={props => (
            <TextField
              {...props}
              label={CodesSettingsLabels.ExpireTime}
              variant="outlined"
              margin="normal"
              value={`${codesExpirationDate.fromNow(true)} (${codesExpirationDate.format('dddd, LL')})`}
              fullWidth
              required
              error={!!error?.message}
              helperText={error?.message}
              inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.PhysicalCodes.ExpirationDate' }}
            />
          )}
        />
      </LocalizationProvider>
    </>
  );
};

export default ExpirationDate;
