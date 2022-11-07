import React from 'react';

import Recipe from '../../builder/templates/Recipe';
import salesforceIcon from '../../../../../../../../assets/images/salesdorce.png';
import { WorkatoProviders } from '../../../../../../store/organisation/integrations/workato/workato.types';

import { salesforceDynamicRecipeConfig } from './salesforceRecipeConstants';
import DynamicSalesforceRecipeConfiguration from './DynamicSalesforceRecipeConfiguration';

const DynamicSalesforceRecipe = (): JSX.Element => (
  <Recipe
    recipeId={salesforceDynamicRecipeConfig.id}
    title={salesforceDynamicRecipeConfig.title}
    integratedAppLogoSrc={salesforceIcon}
    description={salesforceDynamicRecipeConfig.description}
    tiedConnector={WorkatoProviders.Salesforce}
  >
    {({ recipe, actionButtonContainerRef, disabled }) => (
      <DynamicSalesforceRecipeConfiguration
        recipe={recipe}
        isDisabled={disabled}
        buttonContainerRef={actionButtonContainerRef}
      />
    )}
  </Recipe>
);

export default DynamicSalesforceRecipe;
