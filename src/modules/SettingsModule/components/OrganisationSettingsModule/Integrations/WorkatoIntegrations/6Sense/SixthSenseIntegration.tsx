import React from 'react';

import DashboardLayout from '../../../../../../../components/Dashboard/Shared/DashboardLayout';
import { ConnectionsSection } from '../builder/blocks/ConnectionsSection';
import { RecipesSection } from '../builder/blocks/RecipesSection';
import { WorkatoProviders } from '../../../../../store/organisation/integrations/workato/workato.types';

import { SixthSenseObjectRecipe } from './SixthSenseObjectRecipe/SixthSenseObjectRecipe';
import { customObjectRecipe, standardObjectRecipe } from './SixthSenseObjectRecipe/SixthSenseConstants';

interface ISixthSenseIntegrationProps {
  integrationId: string;
}

export const SixthSenseIntegration = ({ integrationId }: ISixthSenseIntegrationProps): JSX.Element => (
  <DashboardLayout>
    <ConnectionsSection integrationId={integrationId} />
    <RecipesSection>
      <SixthSenseObjectRecipe
        recipeId={standardObjectRecipe.id}
        title={standardObjectRecipe.title}
        description={standardObjectRecipe.description}
        tiedConnector={WorkatoProviders.Salesforce}
      />
      <SixthSenseObjectRecipe
        recipeId={customObjectRecipe.id}
        title={customObjectRecipe.title}
        description={customObjectRecipe.description}
        tiedConnector={WorkatoProviders.Salesforce}
      />
    </RecipesSection>
  </DashboardLayout>
);
