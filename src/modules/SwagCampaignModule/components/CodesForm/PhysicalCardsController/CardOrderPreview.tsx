import React from 'react';
import { Box, Grid } from '@mui/material';
import { SFormLabel } from '@alycecom/modules';

import { TSwagCardOrder } from '../../../store/swagCampaign/swagCampaign.types';
import { CodesType } from '../../../store/swagCampaign/steps/codes/codes.constants';

export interface ICardOrderPrewviewProps {
  cardOrder: TSwagCardOrder | null;
}

const CardOrderPreview = ({ cardOrder }: ICardOrderPrewviewProps): JSX.Element => (
  <Grid component={Box} container xs={12} p={2} m={2}>
    <Grid item xs={2}>
      <Box mb={1}>
        <SFormLabel>Format</SFormLabel>
      </Box>
      <Box>{cardOrder?.codeFormat}</Box>
    </Grid>
    <Grid item xs={2}>
      <Box mb={1}>
        <SFormLabel>Amount</SFormLabel>
      </Box>
      <Box>{cardOrder?.codesAmount}</Box>
    </Grid>
    {cardOrder?.codeFormat === CodesType.Physical && (
      <Grid item xs={4}>
        <Box mb={1}>
          <SFormLabel>Send to</SFormLabel>
        </Box>
        <Box>{cardOrder?.contactName}</Box>
        <Box>{cardOrder?.deliveryAddress?.addressLine1}</Box>
        {cardOrder?.deliveryAddress?.addressLine2 && <Box>{cardOrder?.deliveryAddress?.addressLine2}</Box>}
        <Box>
          {cardOrder?.deliveryAddress?.city}, {cardOrder?.deliveryAddress?.state} {cardOrder?.deliveryAddress?.zip}
        </Box>
      </Grid>
    )}
  </Grid>
);

export default CardOrderPreview;
