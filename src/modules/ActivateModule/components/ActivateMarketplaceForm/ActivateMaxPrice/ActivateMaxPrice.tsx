import React, { memo } from 'react';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Controller, Control, FieldError, UseFormTrigger } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';

import { IMarketplaceFormValues, MarketplaceFormFields } from '../../../store/steps/gift/gift.schemas';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  field: {
    width: 110,
    marginRight: spacing(3),
  },
}));

export interface IActivateMaxPriceProps {
  isBlocked: boolean;
  control: Control<IMarketplaceFormValues>;
  error?: FieldError;
  trigger: UseFormTrigger<IMarketplaceFormValues>;
}

const ActivateMaxPrice = ({ isBlocked, control, error, trigger }: IActivateMaxPriceProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={MarketplaceFormFields.MaxBudgetPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          className={classes.field}
          onValueChange={({ floatValue }) => {
            onChange(floatValue);
            trigger(MarketplaceFormFields.MinBudgetPrice);
          }}
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          placeholder="$"
          InputLabelProps={{ shrink: true }}
          value={value === null ? '' : value}
          variant="outlined"
          label="Maximum"
          error={!!error}
          helperText={error?.message}
          inputProps={{
            min: 0,
          }}
          disabled={isBlocked}
          required={!isBlocked}
        />
      )}
    />
  );
};

export default memo(ActivateMaxPrice);
