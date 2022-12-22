import React, { memo } from 'react';
import { Grid, Typography } from '@mui/material';
import { AlyceTheme, Icon } from '@alycecom/ui';

const styles = {
  icon: {
    fontSize: 32,
    color: ({ palette }: AlyceTheme) => palette.grey.superLight,
    mr: 2,
  },
} as const;

export interface IEmptyDatasetProps {
  dataSetName?: string;
  teamName?: string;
  customText?: string;
}

const EmptyDataset = ({ dataSetName, teamName, customText }: IEmptyDatasetProps): JSX.Element => (
  <Grid container direction="row" justifyContent="center" alignItems="center">
    <Icon icon="info-circle" sx={styles.icon} />
    <Typography className="H3-Dark">
      {customText || `There’s no ${dataSetName} data available ${teamName ? `for the ${teamName} team` : ''}`}
    </Typography>
  </Grid>
);

export default memo(EmptyDataset);
