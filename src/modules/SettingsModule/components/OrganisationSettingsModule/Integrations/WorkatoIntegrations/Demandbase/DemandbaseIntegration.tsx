import React from 'react';

import DashboardLayout from '../../../../../../../components/Dashboard/Shared/DashboardLayout';
import { ConnectionsSection } from '../builder/blocks/ConnectionsSection';
import { RecipesSection } from '../builder/blocks/RecipesSection';
import { WorkatoProviders } from '../../../../../store/organisation/integrations/workato/workato.types';

import { DemandbaseRecipe } from './DemandbaseRecipe/DemandbaseRecipe';
import { demandbaseRecipe } from './DemandbaseRecipe/DemandbaseConstants';

interface IDemandbaseIntegrationProps {
  integrationId: string;
}

export const DemandbaseIntegration = ({ integrationId }: IDemandbaseIntegrationProps): JSX.Element => (
  <DashboardLayout>
    <ConnectionsSection integrationId={integrationId} />
    <RecipesSection>
      <DemandbaseRecipe
        recipeId={demandbaseRecipe.id}
        title={demandbaseRecipe.title}
        description={demandbaseRecipe.description}
        tiedConnector={WorkatoProviders.Salesforce}
      />
    </RecipesSection>
  </DashboardLayout>
);
