import React, { memo, useCallback, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalMessage, MessageType } from '@alycecom/services';

import { useOpenIntegration } from '../../../../../../hooks/useOpenIntegration';
import { WorkatoIntegrationContents } from '../../IntegrationsContents';
import { IntegrationCard } from '../../../IntegrationCard/IntegrationCard';
import { IConfigurableIntegration } from '../../../InHouseIntegrations/models/IntegrationsModels';
import { IWorkatoIntegration } from '../../../../../../store/organisation/integrations/workato/workato.types';
import { fetchSfConnectionState } from '../../../../../../store/organisation/integrations/workato/integrations/integrations.actions';
import {
  getIsSfConnectionStateLoading,
  getSfConnectionState,
} from '../../../../../../store/organisation/integrations/workato/integrations/integrations.selectors';

interface IWorkatoSalesforceCardProps extends IConfigurableIntegration {
  integration: IWorkatoIntegration;
}

const WorkatoSalesforceCard = ({ url, integration }: IWorkatoSalesforceCardProps) => {
  const dispatch = useDispatch();
  const { showGlobalMessage } = GlobalMessage.useGlobalMessage();

  const inHouseSfIntegrationConnectionState = useSelector(getSfConnectionState);
  const isInHouseSfConnectionStateLoading = useSelector(getIsSfConnectionStateLoading);
  const selectIntegration = useOpenIntegration(url);
  const { id, enabled } = integration;
  const integrationContent = WorkatoIntegrationContents[id];
  const { route } = integrationContent;

  useEffect(() => {
    dispatch(fetchSfConnectionState());
  }, [dispatch]);

  const handleOpenIntegration = useCallback(() => {
    if (inHouseSfIntegrationConnectionState !== 'connected') {
      showGlobalMessage({
        type: MessageType.Error,
        text: 'Connect the Alyce for Salesforce integration before using this automation',
      });
      return;
    }
    selectIntegration(route, id);
  }, [showGlobalMessage, selectIntegration, route, id, inHouseSfIntegrationConnectionState]);

  if (!integrationContent) {
    return null;
  }

  return (
    <Grid item>
      <IntegrationCard
        title={integrationContent.title}
        logoSrc={integrationContent.icon}
        description={integrationContent.description}
        status={enabled ? 'active' : null}
        isLoading={isInHouseSfConnectionStateLoading}
        open={handleOpenIntegration}
      />
    </Grid>
  );
};

export default memo(WorkatoSalesforceCard);
