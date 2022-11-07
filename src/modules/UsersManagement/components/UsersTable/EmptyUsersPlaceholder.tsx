import React, { memo } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';

const useStyle = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  icon: {
    fontSize: 32,
    color: palette.grey.superLight,
    marginRight: spacing(2),
  },
}));

const EmptyUsersPlaceholder = (): JSX.Element => {
  const classes = useStyle();
  return (
    <Box pt={8} pb={8}>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Icon icon="info-circle" className={classes.icon} />
        <Typography className="H3-Dark">Let’s get your users into Alyce</Typography>
      </Grid>
    </Box>
  );
};

export default memo(EmptyUsersPlaceholder);
