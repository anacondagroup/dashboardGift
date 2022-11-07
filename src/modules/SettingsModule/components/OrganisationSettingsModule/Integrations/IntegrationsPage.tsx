import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Paper, Theme, Typography, useMediaQuery } from '@mui/material';
import { Features } from '@alycecom/modules';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import { getIsWorkatoIntegrationEnabled } from '../../../store/organisation/integrations/workato/workato.selectors';

import HubspotIntegration from './InHouseIntegrations/HubspotIntegration/HubspotIntegration';
import EloquaIntegration from './InHouseIntegrations/EloquaIntegration/EloquaIntegration';
import MarketoIntegration from './InHouseIntegrations/MarketoIntegration/MarketoIntegration';
import SalesforceIntegration from './InHouseIntegrations/SalesforceIntegration/SalesforceIntegration';
import WorkatoIntegrations from './WorkatoIntegrations/WorkatoIntegrations';

const styles = {
  paper: {
    p: 2,
  },
  sectionDescription: {
    fontSize: 14,
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

interface IOrganisationIntegrationsPageProps {
  url: string;
}

const IntegrationsPage = ({ url }: IOrganisationIntegrationsPageProps): JSX.Element => {
  const matchesSmScreen = useMediaQuery('(max-width:1115px)');

  const hubspotFeatureFlagEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.HUBSPOT_INTEGRATION), []),
  );

  const isWorkatoIntegrationEnabled = useSelector(getIsWorkatoIntegrationEnabled);

  return (
    <DashboardLayout>
      <Box mb={4}>
        <Box mb={2}>
          <Typography className="H3-Dark">Integrations</Typography>
          <Typography sx={styles.sectionDescription}>
            Integrations enable you to incorporate Alyce gifting inside of your current workflows to streamline your
            gifting motion.
          </Typography>
        </Box>
        <Paper elevation={1} sx={styles.paper}>
          <Grid
            container
            direction="row"
            justifyContent={matchesSmScreen ? 'center' : 'flex-start'}
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item>
              <SalesforceIntegration url={url} />
            </Grid>
            <Grid item>
              <MarketoIntegration url={url} />
            </Grid>
            {hubspotFeatureFlagEnabled && (
              <Grid item>
                <HubspotIntegration />
              </Grid>
            )}
            <Grid item>
              <EloquaIntegration />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {isWorkatoIntegrationEnabled && <WorkatoIntegrations parentUrl={url} />}
    </DashboardLayout>
  );
};

export default IntegrationsPage;
