import React from 'react';

import DashboardLayout from '../../../../../../../components/Dashboard/Shared/DashboardLayout';
import { ConnectionsSection } from '../builder/blocks/ConnectionsSection';
import { RecipesSection } from '../builder/blocks/RecipesSection';

import DynamicSalesforceRecipe from './DynamicSalesforceRecipe/DynamicSalesforceRecipe';

interface ISalesforceIntegrationProps {
  integrationId: string;
}

const SalesforceIntegration = ({ integrationId }: ISalesforceIntegrationProps): JSX.Element => (
  <DashboardLayout>
    <ConnectionsSection integrationId={integrationId} />
    <RecipesSection>
      <DynamicSalesforceRecipe />
    </RecipesSection>
  </DashboardLayout>
);

export default SalesforceIntegration;
