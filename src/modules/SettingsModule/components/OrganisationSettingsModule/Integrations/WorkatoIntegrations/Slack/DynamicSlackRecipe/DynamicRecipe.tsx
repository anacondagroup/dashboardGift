import React from 'react';

import slackLogo from '../../../../../../../../assets/images/slack.png';
import Recipe from '../../builder/templates/Recipe';
import { WorkatoProviders } from '../../../../../../store/organisation/integrations/workato/workato.types';

import { dynamicSlackRecipe } from './dynamicSlackRecipeConstants';
import DynamicSlackRecipeConfiguration from './DynamicSlackRecipeConfiguration';

interface IDynamicSlackRecipeProps {
  recipeId: string;
}

const DynamicRecipe = ({ recipeId }: IDynamicSlackRecipeProps): JSX.Element => (
  <Recipe
    title={dynamicSlackRecipe.title}
    integratedAppLogoSrc={slackLogo}
    description={dynamicSlackRecipe.description}
    recipeId={recipeId}
    tiedConnector={WorkatoProviders.Slack}
  >
    {({ recipe, actionButtonContainerRef, disabled }) => (
      <DynamicSlackRecipeConfiguration
        recipe={recipe}
        isDisabled={disabled}
        buttonContainerRef={actionButtonContainerRef}
      />
    )}
  </Recipe>
);

export default DynamicRecipe;
