import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionSummary, Theme, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  getIsLoadingWorkatoConnections,
  getWorkatoIntegrationConnectionsList,
  getConnectionsForAuthorizing,
} from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import { fetchWorkatoConnectionsByIntegration } from '../../../../../../store/organisation/integrations/workato/connections/connections.actions';
import { fetchWorkatoRecipesByIntegration } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';
import { WorkatoConnectionSetup } from '../templates/WorkatoConnectionSetup';
import SectionLoader from '../templates/SectionLoader';
import { WorkatoIntegrationContents } from '../../IntegrationsContents';
import { IntegrationLayout } from '../templates/IntegrationLayout';
import {
  IWorkatoConnection,
  permanentlyClosedConnectionsCountThreshold,
} from '../../../../../../store/organisation/integrations/workato/workato.types';

const styles = {
  accordion: {
    marginTop: 3,
    border: ({ palette }: Theme) => `1px solid ${palette.divider}`,
  },
} as const;

interface IIntegrationConnectionConfigSetupProps {
  integrationId: string;
}

export const ConnectionsSection = ({ integrationId }: IIntegrationConnectionConfigSetupProps): JSX.Element => {
  const dispatch = useDispatch();

  const integrationContent = WorkatoIntegrationContents[integrationId];

  const connections = useSelector(getWorkatoIntegrationConnectionsList);
  const isLoadingConnections = useSelector(getIsLoadingWorkatoConnections);
  const connectionsForAuthorizing = useSelector(getConnectionsForAuthorizing);

  useEffect(() => {
    dispatch(fetchWorkatoConnectionsByIntegration({ integrationId }));
    dispatch(fetchWorkatoRecipesByIntegration({ integrationId }));
  }, [dispatch, integrationId]);

  const [connectionsStatuses, setConnectionStatuses] = useState<Record<string, boolean>>({});

  const handleConnectionStatusChange = (connectionId: string) => {
    setConnectionStatuses({ ...connectionsStatuses, [connectionId]: !connectionsStatuses[connectionId] });
  };

  useEffect(() => {
    if (connections) {
      const connectionsMap = connections.reduce(
        (acc, curr) => ({ ...acc, [curr.workatoConnectionId]: curr.authorizedAt !== null }),
        {},
      );
      setConnectionStatuses(connectionsMap);
    }
  }, [connections]);

  const isLoadingConnectionsSection = isLoadingConnections || Object.keys(connectionsStatuses).length === 0;

  const defineExpanded = (connection: IWorkatoConnection) =>
    connectionsForAuthorizing.length >= permanentlyClosedConnectionsCountThreshold
      ? undefined
      : !connectionsStatuses[connection.workatoConnectionId];

  const connectionsQuantity = connectionsForAuthorizing.length;

  return (
    <>
      <IntegrationLayout integrationId={integrationId}>
        <SectionLoader isLoading={isLoadingConnectionsSection}>
          {connectionsForAuthorizing.map(connection => (
            <Accordion
              key={connection.uuid}
              expanded={defineExpanded(connection)}
              onChange={() => handleConnectionStatusChange(connection.workatoConnectionId)}
              sx={styles.accordion}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="Body-Regular-Center-Chambray">
                  Manage your {integrationContent?.title} integration
                  {integrationContent.via &&
                    ` via ${connection.provider.charAt(0).toUpperCase() + connection.provider.slice(1)}`}
                </Typography>
              </AccordionSummary>
              <WorkatoConnectionSetup
                key={connection.uuid}
                connection={connection}
                heightFactor={connectionsQuantity}
              />
            </Accordion>
          ))}
        </SectionLoader>
      </IntegrationLayout>
    </>
  );
};
