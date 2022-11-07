import React from 'react';
import PropTypes from 'prop-types';
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

interface INoCampaignsPropTypes {
  dataSetName?: string;
  teamName?: string;
}

const NoCampaigns = ({ dataSetName, teamName }: INoCampaignsPropTypes): JSX.Element => {
  const classes = useStyle();
  return (
    <Box pt={8} pb={8}>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Icon icon="info-circle" className={classes.icon} />
        <Typography className="H3-Dark">
          {`There’s no ${dataSetName} data available ${teamName ? `for the ${teamName} team` : ''}`}
        </Typography>
      </Grid>
    </Box>
  );
};

NoCampaigns.propTypes = {
  dataSetName: PropTypes.string,
  teamName: PropTypes.string,
};

NoCampaigns.defaultProps = {
  dataSetName: '',
  teamName: '',
};

export default NoCampaigns;
