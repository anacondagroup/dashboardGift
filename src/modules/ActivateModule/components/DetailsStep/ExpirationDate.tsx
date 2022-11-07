import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

import { DetailsFormFields, minimumValidDate } from '../../store/steps/details/detailsForm.schemas';
import SelectExpirationDate from '../../../../components/Shared/SelectExpirationDate/SelectExpirationDate';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  expiryControl: {
    width: 400,
  },
  helperText: {
    color: palette.grey.main,
    fontSize: 14,
  },
}));

const ExpirationDate = (): JSX.Element => {
  const classes = useStyles();
  const { control } = useFormContext();
  return (
    <>
      <Box className={classes.expiryControl}>
        <Controller
          control={control}
          name={DetailsFormFields.ExpirationDate}
          render={({ field: { onChange, value } }) => (
            <SelectExpirationDate
              label="(Optional) When should this campaign link expire?"
              value={value}
              onChange={onChange}
              minDate={minimumValidDate}
              margin="none"
            />
          )}
        />
      </Box>
      <Typography className={classes.helperText}>
        Campaigns with no expiry will allow gift redemption indefinitely, until a campaign is deactivated.
      </Typography>
    </>
  );
};

export default ExpirationDate;
