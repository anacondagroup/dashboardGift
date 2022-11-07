import React, { useCallback, useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { MenuItem, Box, TextField } from '@mui/material';
import { SelectFilter } from '@alycecom/ui';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';

export const REQUEST_DATE_FORMAT = 'YYYY-MM-DD';

const NEVER_EXPIRES = 'NEVER_EXPIRES';
const CUSTOM_DATE = 'CUSTOM_DATE';

const expirationDateOptions = [
  {
    label: 'Never expires',
    value: NEVER_EXPIRES,
  },
  {
    label: 'Custom date',
    value: CUSTOM_DATE,
  },
];

const formatExpirationDate = (momentDate: Moment) => momentDate.format(REQUEST_DATE_FORMAT);
const convertStringDateIntoMoment = (value: string) => {
  const date = moment(value);
  return moment().set({
    year: date.year(),
    month: date.month(),
    date: date.date(),
  });
};
export const calculateDateDiff = (expirationDate: Moment): string => {
  const today = moment().startOf('day');
  const data = expirationDate.startOf('day');

  if (data.isSame(today)) {
    return 'today';
  }

  const diff = data.diff(today, 'days');
  const suffix = ' ago';
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  if (diff === 0) {
    return `${diff} day`;
  }

  if (absDiff > 1) {
    return `${absDiff} days${isPast ? suffix : ''}`;
  }

  return `${absDiff} day${isPast ? suffix : ''}`;
};

export interface ISelectExpirationDateProps {
  label: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  defaultExpirationDate?: Moment;
  minDate?: string | Moment;
  margin?: 'dense' | 'normal' | 'none';
  fullWidth?: boolean;
}

const SelectExpirationDate = ({
  label,
  value,
  onChange = () => {},
  defaultExpirationDate = moment().add(90, 'd'),
  minDate = moment().add(1, 'day'),
  margin = 'normal',
  fullWidth = true,
}: ISelectExpirationDateProps): JSX.Element => {
  const [expirationDateOption, setExpirationDateOption] = useState(value ? CUSTOM_DATE : NEVER_EXPIRES);
  const [codesExpirationDate, setExpirationDate] = useState<Moment>(
    value ? convertStringDateIntoMoment(value) : defaultExpirationDate,
  );
  const onExpirationDateOptionChange = useCallback(
    ({ selectLinkExpirationOption }) => {
      setExpirationDateOption(selectLinkExpirationOption);

      if (selectLinkExpirationOption === NEVER_EXPIRES) {
        onChange(null);
      }
    },
    [onChange],
  );

  const onExpirationDateChange = useCallback(
    (date: Moment) => {
      setExpirationDate(date);
      onChange(formatExpirationDate(date));
    },
    [onChange],
  );

  useEffect(() => {
    if (expirationDateOption === CUSTOM_DATE) {
      onChange(formatExpirationDate(codesExpirationDate));
    }
  }, [expirationDateOption, codesExpirationDate, onChange]);

  useEffect(() => {
    if (value) {
      setExpirationDateOption(CUSTOM_DATE);
      setExpirationDate(convertStringDateIntoMoment(value));
    }
  }, [value]);

  return (
    <Box>
      <Box mb={1}>
        <SelectFilter
          label={label}
          name="selectLinkExpirationOption"
          margin={margin}
          value={expirationDateOption}
          onFilterChange={onExpirationDateOptionChange}
          renderItems={() =>
            expirationDateOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          }
          fullWidth={fullWidth}
        />
      </Box>
      {expirationDateOption === CUSTOM_DATE && (
        <Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              value={codesExpirationDate}
              onChange={date => onExpirationDateChange(moment(date))}
              inputFormat={`[${calculateDateDiff(codesExpirationDate)}] (dddd, LL)`}
              disablePast
              minDate={moment(minDate)}
              renderInput={props => (
                <TextField {...props} variant="outlined" fullWidth={fullWidth} label="Expiration date" />
              )}
            />
          </LocalizationProvider>
        </Box>
      )}
    </Box>
  );
};

export default SelectExpirationDate;
