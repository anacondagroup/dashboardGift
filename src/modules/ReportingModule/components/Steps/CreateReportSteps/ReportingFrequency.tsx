/* eslint-disable no-underscore-dangle */
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import classNames from 'classnames';
import { Controller, useFormContext } from 'react-hook-form';
import React, { memo, useCallback } from 'react';
import { makeStyles } from '@mui/styles';

import { days, frequency, hoursList, monthDays } from '../../../store/reporting/reporting.constants';
import { ReportingFrequencyEnum } from '../../../../SettingsModule/constants/reporting.constants';

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    marginBottom: spacing(2.8),
  },
  frequency: {
    width: 219,
  },
  on: {
    margin: spacing(0, 2.3, 0, 2.3),
  },
  title: {
    marginBottom: spacing(2.8),
  },
}));

const ReportingFrequency = (): JSX.Element => {
  const classes = useStyles();
  const { control, watch, setValue } = useFormContext();
  const defaultFrequency = watch('frequency');
  const defaultDay = watch('days');
  const defaultTime = watch('time');
  const defaultTimezone = watch('timezone');

  const frequencyDays = useCallback(() => {
    const frequencyValue = control._formValues.frequency.toLowerCase();
    if (frequencyValue === ReportingFrequencyEnum.daily) {
      return [];
    }
    if (frequencyValue === ReportingFrequencyEnum.monthly) {
      return monthDays;
    }
    return days;
  }, [control._formValues.frequency]);

  const daysToShow = frequencyDays();
  const isDayChooseAvailable = control._formValues.frequency.toLowerCase() !== ReportingFrequencyEnum.daily;

  const onChangeFrequencyHandler = useCallback(
    (e: SelectChangeEvent<string>) => {
      setValue('frequency', e.target.value);
      if (e.target.value === frequency[0]) {
        setValue('days', monthDays[0]);
      } else {
        setValue('days', days[5]);
      }
    },
    [setValue],
  );

  return (
    <Box>
      <Box className={classes.box}>
        <Typography className={classNames('Body-Regular-Left-Static-Bold', classes.title)}>
          Reporting Frequency
        </Typography>
        <Grid container direction="row" alignItems="center" className={classes.box}>
          <Grid item className={classes.frequency}>
            <Controller
              control={control}
              name="frequency"
              render={({ field: { value } }) => (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="CreateGiftingTrendsReport.FrequencySelectLabel">Frequency</InputLabel>
                  <Select
                    labelId="CreateGiftingTrendsReport.FrequencySelectSelect"
                    id="CreateGiftingTrendsReport.FrequencySelectSelect"
                    value={value || defaultFrequency}
                    onChange={onChangeFrequencyHandler}
                    input={<OutlinedInput label="Frequency" />}
                  >
                    {frequency.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          {isDayChooseAvailable && (
            <>
              <Grid item>
                <Typography className={classNames('Body-Regular-Left-Static', classes.on)}>on</Typography>
              </Grid>
              <Grid item className={classes.frequency}>
                <Controller
                  control={control}
                  name="days"
                  render={({ field: { onChange, value } }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="CreateGiftingTrendsReport.DayLabel">Day</InputLabel>
                      <Select
                        labelId="CreateGiftingTrendsReport.DaySelect"
                        id="CreateGiftingTrendsReport.DaySelect"
                        value={value || defaultDay}
                        onChange={onChange}
                        input={<OutlinedInput label="Day" />}
                      >
                        {daysToShow.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Grid container direction="row" alignItems="center" className={classes.box}>
        <Grid item>
          <Box className={classes.frequency}>
            <Controller
              control={control}
              name="time"
              render={({ field: { onChange, value } }) => (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="CreateGiftingTrendsReport.TimeLabel">Specify Time</InputLabel>
                  <Select
                    labelId="CreateGiftingTrendsReport.TimeSelect"
                    id="CreateGiftingTrendsReport.TimeSelect"
                    value={value || defaultTime}
                    onChange={onChange}
                    input={<OutlinedInput label="Specify Time" />}
                  >
                    {hoursList.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography className={classNames('Body-Regular-Left-Static', classes.on)}>{defaultTimezone}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(ReportingFrequency);
