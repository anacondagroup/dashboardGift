import React, { memo } from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Controller, useFormContext } from 'react-hook-form';

const useStyles = makeStyles(({ palette }) => ({
  radioInput: {
    color: palette.link.main,
  },
  radioLabel: {
    '& > $label': {
      fontWeight: 700,
      color: palette.link.main,
    },
    '& > $checked,& > $checked + $label': {
      color: palette.primary.main,
    },
  },
  checked: {},
  label: {},
}));

const ComplianceIsRequiredController = () => {
  const { control } = useFormContext();

  const classes = useStyles();
  return (
    <Controller
      name="complianceIsRequired"
      control={control}
      render={({ field }) => (
        <RadioGroup row {...field}>
          <FormControlLabel
            classes={{
              root: classes.radioLabel,
              label: classes.label,
            }}
            value="false"
            control={<Radio classes={{ root: classes.radioInput, checked: classes.checked }} />}
            label="No, do not ask team members"
          />
          <FormControlLabel
            classes={{
              root: classes.radioLabel,
              label: classes.label,
            }}
            value="true"
            control={<Radio classes={{ root: classes.radioInput, checked: classes.checked }} />}
            label="Yes, ask team members"
          />
        </RadioGroup>
      )}
    />
  );
};

export default memo(ComplianceIsRequiredController);
