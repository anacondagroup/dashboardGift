import React, { useEffect, memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, TextField, TextFieldProps, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import { selectors } from '../../../../../store/teams/generalSettings';

const useStyles = makeStyles(({ spacing, palette }) => ({
  tooltip: {
    padding: spacing(2),
    backgroundColor: palette.common.white,
    color: palette.text.secondary,
    boxShadow: '0px 1px 12px 1px rgba(0,0,0,0.15)',
    fontSize: '14px',
    '& > $arrow': {
      color: palette.common.white,
    },
  },
  arrow: {},
}));

interface IComplianceTextFieldProps {
  name: string;
  label?: string;
  tooltipText?: string;
  textFieldProps: TextFieldProps;
}

const ComplianceTextField = ({
  label = '',
  tooltipText = '',
  name,
  textFieldProps = {},
}: IComplianceTextFieldProps) => {
  const classes = useStyles();
  const getManualErrorMessage = useMemo(() => selectors.getErrorByProp(name), [name]);
  const manualErrorMessage = useSelector(getManualErrorMessage);
  const {
    register,
    setError,
    formState: { errors },
  } = useFormContext();

  const field = register(name);

  useEffect(() => {
    if (manualErrorMessage) {
      setError(name, { message: manualErrorMessage, type: 'manual' }, { shouldFocus: true });
    }
  }, [manualErrorMessage, name, setError]);

  return (
    <>
      {label && (
        <Box mb={0.5} lineHeight={1.5} fontWeight={700} color="text.primary">
          {label}
          <Tooltip
            classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
            title={tooltipText}
            placement="top"
            arrow
          >
            <Box display="inline-block" ml={1}>
              {/* @ts-ignore */}
              <Icon icon="question-circle" color="link.main" size={0.9} />
            </Box>
          </Tooltip>
        </Box>
      )}
      <TextField
        inputRef={field.ref}
        {...field}
        name={name}
        style={{ lineHeight: 1.5 }}
        variant="outlined"
        error={!!errors[name]}
        helperText={errors[name] && errors[name].message}
        {...textFieldProps}
      />
    </>
  );
};

export default memo(ComplianceTextField);
