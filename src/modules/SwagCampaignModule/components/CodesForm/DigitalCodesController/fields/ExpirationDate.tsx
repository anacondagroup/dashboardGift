import React, { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
import AdapterMoment from '@mui/lab/AdapterMoment';
import moment, { Moment } from 'moment';

import {
  minValidDateForCodes,
  EXPIRATION_DATE_FORMAT,
} from '../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  TDigitalCodesFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../store/swagCampaign/steps/codes/codes.types';

export interface IExpirationDateProps {
  control: Control<TDigitalCodesFormValues>;
}

const formatExpirationDate = (momentDate: Moment) => momentDate.format(EXPIRATION_DATE_FORMAT);

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
      onChange(formatExpirationDate(date));
    },
    [onChange],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        inputFormat={`[${codesExpirationDate.fromNow(true)}] (dddd, LL)`}
        disablePast
        onChange={date => onExpirationChangeDate(moment(date))}
        value={codesExpirationDate}
        mask=""
        minDate={moment(minValidDateForCodes)}
        renderInput={props => (
          <TextField
            {...props}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={`${codesExpirationDate.fromNow(true)} (${codesExpirationDate.format('dddd, LL')})`}
            label={CodesSettingsLabels.ExpireTime}
            error={!!error?.message}
            helperText={error?.message}
            inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.DigitalCodes.ExpirationDate' }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default ExpirationDate;
