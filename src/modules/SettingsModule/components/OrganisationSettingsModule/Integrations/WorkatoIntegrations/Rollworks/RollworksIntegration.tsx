import React from 'react';

import { ConnectionsSection } from '../builder/blocks/ConnectionsSection';
import { RecipesSection } from '../builder/blocks/RecipesSection';
import DashboardLayout from '../../../../../../../components/Dashboard/Shared/DashboardLayout';
import { WorkatoProviders } from '../../../../../store/organisation/integrations/workato/workato.types';

import { RollworksRecipe } from './RollworksRecipe/RollworksRecipe';
import { rollworksViaHubSpotRecipe, rollworksViaSalesforceRecipe } from './RollworksRecipe/RollworksConstants';

interface IRollworksIntegrationProps {
  integrationId: string;
}

export const RollworksIntegration = ({ integrationId }: IRollworksIntegrationProps): JSX.Element => (
  <DashboardLayout>
    <ConnectionsSection integrationId={integrationId} />
    <RecipesSection>
      <RollworksRecipe
        recipeId={rollworksViaSalesforceRecipe.id}
        title={rollworksViaSalesforceRecipe.title}
        description={rollworksViaSalesforceRecipe.description}
        tiedConnector={WorkatoProviders.Salesforce}
      />
      <RollworksRecipe
        recipeId={rollworksViaHubSpotRecipe.id}
        title={rollworksViaHubSpotRecipe.title}
        description={rollworksViaHubSpotRecipe.description}
        tiedConnector={WorkatoProviders.Hubspot}
      />
    </RecipesSection>
  </DashboardLayout>
);
