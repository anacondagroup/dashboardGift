import React from 'react';

import DashboardLayout from '../../../../../../../components/Dashboard/Shared/DashboardLayout';
import { ConnectionsSection } from '../builder/blocks/ConnectionsSection';
import { RecipesSection } from '../builder/blocks/RecipesSection';
import StaticRecipe from '../builder/templates/StaticRecipe';
import slackLogo from '../../../../../../../assets/images/slack.png';
import { WorkatoProviders } from '../../../../../store/organisation/integrations/workato/workato.types';

import DynamicRecipe from './DynamicSlackRecipe/DynamicRecipe';
import { dynamicSlackRecipe, staticSlackRecipe } from './DynamicSlackRecipe/dynamicSlackRecipeConstants';

interface ISlackIntegrationProps {
  integrationId: string;
}

export const SlackIntegration = ({ integrationId }: ISlackIntegrationProps): JSX.Element => (
  <DashboardLayout>
    <ConnectionsSection integrationId={integrationId} />
    <RecipesSection>
      <StaticRecipe
        recipeId={staticSlackRecipe.id}
        title={staticSlackRecipe.title}
        integratedAppLogoSrc={slackLogo}
        description={staticSlackRecipe.description}
        tiedConnector={WorkatoProviders.Slack}
      />
      <DynamicRecipe recipeId={dynamicSlackRecipe.id} />
    </RecipesSection>
  </DashboardLayout>
);
