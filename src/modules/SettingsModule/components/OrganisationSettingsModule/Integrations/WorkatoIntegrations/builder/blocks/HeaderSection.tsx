import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { AlyceTheme, LinkButton, LoadingWrapper } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

import { WorkatoIntegrationContents } from '../../IntegrationsContents';
import IntegrationCardStatusLabel from '../../../IntegrationCard/IntegrationCardStatusLabel';
import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_CONNECTED,
} from '../../../../../../constants/organizationSettings.constants';
import {
  getIfAnyConnectionIsAuthorized,
  getIsLoadingWorkatoConnections,
} from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import { getIsCurrentIntegrationActive } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import { getIsLoadingSomeToken } from '../../../../../../store/organisation/integrations/workato/oauth/oauth.selectors';

interface IDescriptionSectionProps {
  integrationId: string;
}

const useStyles = makeStyles<AlyceTheme>(() => ({
  docsLink: {
    display: 'inline-block',
  },
}));

export const HeaderSection = ({ integrationId }: IDescriptionSectionProps): JSX.Element => {
  const classes = useStyles();
  const integrationContent = WorkatoIntegrationContents[integrationId];

  const isLoadingToken = useSelector(getIsLoadingSomeToken);
  const isAnyConnectionStatusAuthorized = useSelector(getIfAnyConnectionIsAuthorized);
  const isLoadingConnections = useSelector(getIsLoadingWorkatoConnections);
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);

  const integrationStatus = useMemo(() => {
    if (isCurrentIntegrationActive) {
      return INTEGRATION_STATUS_ACTIVE;
    }
    if (isAnyConnectionStatusAuthorized) {
      return INTEGRATION_STATUS_CONNECTED;
    }
    return null;
  }, [isAnyConnectionStatusAuthorized, isCurrentIntegrationActive]);

  return (
    <>
      <Grid container alignItems="center" spacing={4}>
        <Grid item>
          <Typography className="H3-Dark">{integrationContent?.title}</Typography>
        </Grid>
        <Grid item>
          <LoadingWrapper isLoading={isLoadingConnections || isLoadingToken}>
            <IntegrationCardStatusLabel title={integrationContent?.title || ''} status={integrationStatus} />
          </LoadingWrapper>
        </Grid>
      </Grid>
      <Box>
        <Typography component="div" className="Body-Regular-Left-Inactive">
          Please connect your Alyce account to the {integrationContent?.title} integration. If you need any help, feel
          free to reach out to us or{' '}
          <LinkButton className={classes.docsLink}>
            <a target="_blank" rel="noopener noreferrer" href={integrationContent?.helpDocLink}>
              view our help docs
            </a>
          </LinkButton>
        </Typography>
      </Box>
    </>
  );
};
