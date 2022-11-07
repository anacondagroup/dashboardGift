import React from 'react';

import Recipe, { IRecipeProps } from '../../builder/templates/Recipe';
import sixthSenseLogo from '../../../../../../../../assets/images/6sense.png';

import { SixthSenseObjectRecipeConfiguration } from './SixthSenseObjectRecipeConfiguration';

interface ISixthSenseObjectRecipeProps
  extends Omit<IRecipeProps, 'onRecipeAction' | 'children' | 'integratedAppLogoSrc'> {}

export const SixthSenseObjectRecipe = ({
  recipeId,
  title,
  description,
  ...recipeProps
}: ISixthSenseObjectRecipeProps): JSX.Element => (
  <Recipe
    title={title}
    integratedAppLogoSrc={sixthSenseLogo}
    description={description}
    recipeId={recipeId}
    appToAlyce
    {...recipeProps}
  >
    {({ recipe, actionButtonContainerRef, disabled }) => (
      <SixthSenseObjectRecipeConfiguration
        recipe={recipe}
        isDisabled={disabled}
        buttonContainerRef={actionButtonContainerRef}
      />
    )}
  </Recipe>
);
