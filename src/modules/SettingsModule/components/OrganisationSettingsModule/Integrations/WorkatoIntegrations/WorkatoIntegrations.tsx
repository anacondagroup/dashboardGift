import React, { useEffect } from 'react';
import { Box, Grid, Paper, Theme, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import IntegrationCardSkeleton from '../IntegrationCard/IntegrationCardSkeleton';
import { fetchWorkatoIntegrations } from '../../../../store/organisation/integrations/workato/integrations/integrations.actions';
import { fetchOrganizationSubscriptions } from '../../../../store/organisation/integrations/workato/subscription/subscription.actions';
import {
  getIsSubscriptionLoading,
  getSubscription,
} from '../../../../store/organisation/integrations/workato/subscription/subscription.selectors';
import {
  getIsWorkatoIntegrationsLoading,
  getWorkatoIntegrations,
} from '../../../../store/organisation/integrations/workato/integrations/integrations.selectors';

import WorkatoIntegrationCard from './Cards/WorkatoIntegrationCard/WorkatoIntegrationCard';
import ActiveIntegrationsBanner from './ActiveIntegrationsBanner/AvailableIntegrtationsLimit';
import ActiveIntegrationsNumber from './ActiveIntegrationsBanner/ActiveIntegrationsNumber';
import WorkatoSalesforceCard from './Cards/WorkatoSalesforceCard/WorkatoSalesforceCard';

const styles = {
  paper: {
    p: 2,
  },
  sectionDescription: {
    fontSize: 14,
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

export interface IWorkatoIntegrationsProps {
  parentUrl: string;
}

const WorkatoIntegrations = ({ parentUrl }: IWorkatoIntegrationsProps): JSX.Element => {
  const dispatch = useDispatch();
  const matchesSmScreen = useMediaQuery('(max-width:1115px)');

  const isWorkatoIntegrationsLoading = useSelector(getIsWorkatoIntegrationsLoading);
  const workatoIntegrations = useSelector(getWorkatoIntegrations);

  const isSubscriptionLoading = useSelector(getIsSubscriptionLoading);
  const subscription = useSelector(getSubscription);

  const displayActiveIntegrationsCounter = subscription && subscription.enabled > 0;

  const displayActiveIntegrationsBanner = subscription && subscription.enabled === subscription.allowed;

  useEffect(() => {
    dispatch(fetchWorkatoIntegrations());
    dispatch(fetchOrganizationSubscriptions());
  }, [dispatch]);

  return (
    <Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Typography className="H3-Dark">Automations</Typography>
          </Box>
          {displayActiveIntegrationsCounter && <ActiveIntegrationsNumber activeIntegrations={subscription?.enabled} />}
        </Box>
        <Typography sx={styles.sectionDescription}>
          Automations enable your team to trigger gift sending and notifications to optimize your gifting motion.
        </Typography>
      </Box>
      {displayActiveIntegrationsBanner && (
        <Box mb={2}>
          <ActiveIntegrationsBanner isLoading={isSubscriptionLoading} subscription={subscription} />
        </Box>
      )}
      <Paper elevation={1} sx={styles.paper}>
        <Grid
          container
          direction="row"
          justifyContent={matchesSmScreen ? 'center' : 'flex-start'}
          alignItems="flex-start"
          spacing={2}
        >
          {isWorkatoIntegrationsLoading && (
            <Grid item>
              <IntegrationCardSkeleton />
            </Grid>
          )}

          {workatoIntegrations && (
            <>
              {workatoIntegrations.salesforce && (
                <WorkatoSalesforceCard integration={workatoIntegrations.salesforce} url={parentUrl} />
              )}
              {workatoIntegrations.slack && (
                <WorkatoIntegrationCard integration={workatoIntegrations.slack} url={parentUrl} />
              )}
              {workatoIntegrations['6sense'] && (
                <WorkatoIntegrationCard integration={workatoIntegrations['6sense']} url={parentUrl} />
              )}
              {workatoIntegrations.demandbase && (
                <WorkatoIntegrationCard integration={workatoIntegrations.demandbase} url={parentUrl} />
              )}
              {workatoIntegrations.teams && (
                <WorkatoIntegrationCard integration={workatoIntegrations.teams} url={parentUrl} />
              )}
              {workatoIntegrations.rollworks && (
                <WorkatoIntegrationCard integration={workatoIntegrations.rollworks} url={parentUrl} />
              )}
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default WorkatoIntegrations;
