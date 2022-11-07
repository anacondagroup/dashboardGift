import React from 'react';

import Recipe, { IRecipeProps } from '../../builder/templates/Recipe';
import demandbaseLogo from '../../../../../../../../assets/images/demandbase.jpeg';

import { DemandbaseRecipeConfiguration } from './DemandbaseRecipeConfiguration';

interface IDemandbaseRecipeProps extends Omit<IRecipeProps, 'onRecipeAction' | 'children' | 'integratedAppLogoSrc'> {}

export const DemandbaseRecipe = ({
  recipeId,
  title,
  description,
  ...recipeProps
}: IDemandbaseRecipeProps): JSX.Element => (
  <Recipe
    title={title}
    integratedAppLogoSrc={demandbaseLogo}
    description={description}
    recipeId={recipeId}
    appToAlyce
    {...recipeProps}
  >
    {({ recipe, actionButtonContainerRef, disabled }) => (
      <DemandbaseRecipeConfiguration
        recipe={recipe}
        isDisabled={disabled}
        buttonContainerRef={actionButtonContainerRef}
      />
    )}
  </Recipe>
);
