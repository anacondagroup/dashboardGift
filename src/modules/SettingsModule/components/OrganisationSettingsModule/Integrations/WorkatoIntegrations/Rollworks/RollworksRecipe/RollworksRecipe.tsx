import React from 'react';

import Recipe, { IRecipeProps } from '../../builder/templates/Recipe';
import rollworksLogo from '../../../../../../../../assets/images/rollworks.png';

import { RollworksRecipeConfiguration } from './RollworksRecipeConfiguration';

interface IRollworksRecipeProps extends Omit<IRecipeProps, 'onRecipeAction' | 'children' | 'integratedAppLogoSrc'> {}

export const RollworksRecipe = ({
  recipeId,
  title,
  description,
  tiedConnector,
  ...recipeProps
}: IRollworksRecipeProps): JSX.Element => (
  <Recipe
    title={title}
    integratedAppLogoSrc={rollworksLogo}
    description={description}
    recipeId={recipeId}
    appToAlyce
    tiedConnector={tiedConnector}
    {...recipeProps}
  >
    {({ recipe, actionButtonContainerRef, disabled }) => (
      <RollworksRecipeConfiguration
        recipe={recipe}
        isDisabled={disabled}
        buttonContainerRef={actionButtonContainerRef}
        tiedConnector={tiedConnector}
      />
    )}
  </Recipe>
);
