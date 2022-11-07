import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';
import { dissoc } from 'ramda';

import { IWorkatoRecipe } from '../workato.types';

import { fetchWorkatoRecipesByIntegration, runWorkatoRecipeAction, updateWorkatoRecipeFields } from './recipes.actions';
import { TRecipeDictionaryStatus } from './recipes.types';

export interface TRecipesState {
  status: StateStatus;
  integrationId: string | null;
  list: IWorkatoRecipe[];
  recipeDictionaryStatus: TRecipeDictionaryStatus;
}

const initialState: TRecipesState = {
  status: StateStatus.Idle,
  integrationId: null,
  list: [],
  recipeDictionaryStatus: {},
};

export const recipes = createReducer({}, initialState)
  .on(fetchWorkatoRecipesByIntegration.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchWorkatoRecipesByIntegration.fulfilled, (state, { data, integrationId }) => ({
    ...state,
    integrationId,
    status: StateStatus.Fulfilled,
    list: data,
  }))
  .on(fetchWorkatoRecipesByIntegration.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
    integrationId: null,
    list: [],
  }))

  .on(updateWorkatoRecipeFields.pending, (state, { recipeId }) => ({
    ...state,
    recipeDictionaryStatus: {
      ...state.recipeDictionaryStatus,
      [recipeId]: 'updating',
    },
  }))
  .on(updateWorkatoRecipeFields.fulfilled, (state, updatedRecipe) => ({
    ...state,
    list: state.list.map(recipe => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)),
    recipeDictionaryStatus: dissoc(updatedRecipe.id, state.recipeDictionaryStatus),
  }))
  .on(updateWorkatoRecipeFields.rejected, (state, { recipeId }) => ({
    ...state,
    recipeDictionaryStatus: dissoc(recipeId, state.recipeDictionaryStatus),
  }))

  .on(runWorkatoRecipeAction.pending, (state, { action, recipeId }) => ({
    ...state,
    recipeDictionaryStatus: {
      ...state.recipeDictionaryStatus,
      [recipeId]: action === 'start' ? 'running' : 'stopping',
    },
  }))
  .on(runWorkatoRecipeAction.fulfilled, (state, { action, recipeId }) => ({
    ...state,
    list: state.list.map(recipe => (recipe.id === recipeId ? { ...recipe, running: action === 'start' } : recipe)),
    recipeDictionaryStatus: dissoc(recipeId, state.recipeDictionaryStatus),
  }))
  .on(runWorkatoRecipeAction.rejected, (state, { recipeId }) => ({
    ...state,
    recipeDictionaryStatus: dissoc(recipeId, state.recipeDictionaryStatus),
  }));
