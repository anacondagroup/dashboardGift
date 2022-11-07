import React, { memo } from 'react';
import { Grid } from '@mui/material';

import { IntegrationCard } from '../../../IntegrationCard/IntegrationCard';
import { IConfigurableIntegration } from '../../../InHouseIntegrations/models/IntegrationsModels';
import { useOpenIntegration } from '../../../../../../hooks/useOpenIntegration';
import { IWorkatoIntegration } from '../../../../../../store/organisation/integrations/workato/workato.types';
import { WorkatoIntegrationContents } from '../../IntegrationsContents';

interface IWorkatoIntegrationCardProps extends IConfigurableIntegration {
  integration: IWorkatoIntegration;
}

const WorkatoIntegrationCard = ({ url, integration }: IWorkatoIntegrationCardProps): JSX.Element | null => {
  const selectIntegration = useOpenIntegration(url);
  const { id, enabled } = integration;

  const integrationContent = WorkatoIntegrationContents[id];

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
        open={() => selectIntegration(integrationContent.route, id)}
      />
    </Grid>
  );
};

export default memo(WorkatoIntegrationCard);
