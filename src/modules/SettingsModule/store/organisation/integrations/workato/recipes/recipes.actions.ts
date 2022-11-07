import { createAsyncAction } from '@alycecom/utils';
import { createAction } from 'redux-act';

import { IWorkatoRecipe } from '../workato.types';

import {
  IWorkatoRecipeExecutionAction,
  IWorkatoRecipeRunAction,
  IWorkatoRecipeRunActionFail,
  IWorkatoRecipeRunActionSuccess,
  IWorkatoRecipesByIntegration,
  IWorkatoRecipesByIntegrationSuccess,
} from './recipes.types';

const prefix = 'SETTINGS_MODULE/WORKATO/RECIPES';

export const fetchWorkatoRecipesByIntegration = createAsyncAction<
  IWorkatoRecipesByIntegration,
  IWorkatoRecipesByIntegrationSuccess
>(`${prefix}/FETCH_RECIPES`);

export const executeWorkatoRecipeAction = createAction<IWorkatoRecipeExecutionAction>(`${prefix}/EXECUTE_RECIPE`);

export const updateWorkatoRecipeFields = createAsyncAction<
  IWorkatoRecipeExecutionAction,
  IWorkatoRecipe,
  IWorkatoRecipeRunActionFail
>(`${prefix}/UPDATE_RECIPE`);

export const runWorkatoRecipeAction = createAsyncAction<
  IWorkatoRecipeRunAction,
  IWorkatoRecipeRunActionSuccess,
  IWorkatoRecipeRunActionFail
>(`${prefix}/FETCH_RUN_RECIPE`);
