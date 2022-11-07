import React, { memo } from 'react';

import { ConnectionsSection } from '../builder/blocks/ConnectionsSection';
import { RecipesSection } from '../builder/blocks/RecipesSection';
import DashboardLayout from '../../../../../../../components/Dashboard/Shared/DashboardLayout';
import StaticRecipe from '../builder/templates/StaticRecipe';
import msTeamsLogo from '../../../../../../../assets/images/ms-teams.svg';
import { WorkatoProviders } from '../../../../../store/organisation/integrations/workato/workato.types';

import { msTeamsStaticRecipeConfig } from './msTeamsRecipeConstants';

interface IMsTeamsIntegrationProps {
  integrationId: string;
}

const MsTeamsIntegration = ({ integrationId }: IMsTeamsIntegrationProps) => (
  <DashboardLayout>
    <ConnectionsSection integrationId={integrationId} />
    <RecipesSection>
      <StaticRecipe
        recipeId={msTeamsStaticRecipeConfig.id}
        title={msTeamsStaticRecipeConfig.title}
        integratedAppLogoSrc={msTeamsLogo}
        description={msTeamsStaticRecipeConfig.description}
        tiedConnector={WorkatoProviders.Teams}
      />
    </RecipesSection>
  </DashboardLayout>
);

export default memo(MsTeamsIntegration);
