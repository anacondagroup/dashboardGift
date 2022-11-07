import React from 'react';
import { Control } from 'react-hook-form';
import { Box, Grid } from '@mui/material';
import { SFormLabel } from '@alycecom/modules';

import { TDigitalCodesFormValues } from '../../../store/swagCampaign/steps/codes/codes.types';

import OrderName from './fields/OrderName';
import TotalCodes from './fields/TotalCodes';
import ExpirationDate from './fields/ExpirationDate';

export interface IDigitalCodesControllerProps {
  control: Control<TDigitalCodesFormValues>;
}

const DigitalCodesController = ({ control }: IDigitalCodesControllerProps): JSX.Element => (
  <Grid component={Box} maxWidth={480} direction="column" container spacing={2}>
    <Grid item>
      <OrderName control={control} />
    </Grid>
    <Grid item>
      <TotalCodes control={control} />
    </Grid>
    <Grid item>
      <SFormLabel>When do you want these gift codes to expire?</SFormLabel>
      <ExpirationDate control={control} />
    </Grid>
  </Grid>
);

export default DigitalCodesController;
