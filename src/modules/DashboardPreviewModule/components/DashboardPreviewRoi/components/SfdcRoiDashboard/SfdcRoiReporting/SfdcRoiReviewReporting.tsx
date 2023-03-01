import React from 'react';
import { Grid } from '@mui/material';

import SfdcPipelineSummary from '../SfdcPipelineSummary/SfdcPipelineSummary';

import SfdcRoiInfluencedArr from './SfdcRoiInfluencedArr/SfdcRoiInfluencedArr';

const SfdcRoiReviewReporting = (): JSX.Element => (
  <Grid container spacing={5} direction="column">
    <Grid item>
      <SfdcPipelineSummary />
    </Grid>
    <Grid item>
      <SfdcRoiInfluencedArr />
    </Grid>
  </Grid>
);

export default SfdcRoiReviewReporting;
