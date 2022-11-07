import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { TRecipeAction } from '../../../../../../store/organisation/integrations/workato/workato.types';
import { executeWorkatoRecipeAction } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';

import Recipe, { IRecipeProps } from './Recipe';

interface IStaticRecipeProps extends Omit<IRecipeProps, 'onRecipeAction' | 'children'> {}

const StaticRecipe = ({
  title,
  integratedAppLogoSrc,
  description,
  recipeId,
  ...staticRecipeProps
}: IStaticRecipeProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleRecipeAction = useCallback(
    (action: TRecipeAction) => {
      dispatch(executeWorkatoRecipeAction({ recipeId, action }));
    },
    [dispatch, recipeId],
  );

  return (
    <Recipe
      title={title}
      integratedAppLogoSrc={integratedAppLogoSrc}
      description={description}
      recipeId={recipeId}
      onRecipeAction={handleRecipeAction}
      {...staticRecipeProps}
    />
  );
};

export default StaticRecipe;
