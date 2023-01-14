import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import classNames from 'classnames';
import { Controller, useFormContext } from 'react-hook-form';
import React, { memo } from 'react';
import { makeStyles } from '@mui/styles';

import { reportingTimespan } from '../../../store/reporting/reporting.constants';

const useStyles = makeStyles(({ spacing }) => ({
  reportingTimespan: {
    width: 320,
    display: 'inline-block',
  },
  title: {
    marginBottom: spacing(2.8),
  },
}));

const ReportingCriteria = (): JSX.Element => {
  const classes = useStyles();
  const { control, watch } = useFormContext();
  const defaultReportingTimespan = watch('reportingTimespan');

  return (
    <Box className={classes.reportingTimespan}>
      <Typography className={classNames('Body-Regular-Left-Static-Bold', classes.title)}>Reporting Criteria</Typography>
      <Controller
        control={control}
        name="reportingTimespan"
        render={({ field: { onChange, value } }) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="CreateTeamUsageReport.ReportingTimespanLabel">Reporting Timespan</InputLabel>
            <Select
              labelId="CreateTeamUsageReport.ReportingTimespanSelect"
              id="CreateTeamUsageReport.ReportingTimespanSelect"
              value={value?.value || defaultReportingTimespan}
              onChange={e => onChange(reportingTimespan.find(item => item.value === e.target.value))}
              input={<OutlinedInput label="Reporting Timespan" />}
            >
              {reportingTimespan.map(option => (
                <MenuItem key={option.key} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Box>
  );
};

export default memo(ReportingCriteria);
