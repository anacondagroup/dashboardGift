import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { getIsLoadingWorkatoRecipes } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import SectionLoader from '../templates/SectionLoader';

interface IRecipesSectionProps {
  children: React.ReactNode;
}

export const RecipesSection = ({ children }: IRecipesSectionProps): JSX.Element => {
  const isLoadingRecipes = useSelector(getIsLoadingWorkatoRecipes);

  return (
    <Box mt={3}>
      <Typography className="H4-Dark">Recipes</Typography>
      <SectionLoader isLoading={isLoadingRecipes}>
        <Box mt={3}>{children}</Box>
      </SectionLoader>
    </Box>
  );
};
