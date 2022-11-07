import { IWorkatoRecipe, TRecipeAction } from '../workato.types';

export interface IWorkatoRecipesByIntegration {
  integrationId: string;
}

export interface IWorkatoRecipesByIntegrationSuccess extends IWorkatoRecipesByIntegration {
  data: IWorkatoRecipe[];
}

export interface IWorkatoRecipeExecutionAction {
  action: TRecipeAction;
  recipeId: string;
  fields?: IWorkatoRecipeField[];
}

export interface IWorkatoRecipeRunAction {
  action: TRecipeAction;
  recipeId: string;
}

export interface IWorkatoRecipeField {
  code: string;
  value: string;
}

export interface IWorkatoRecipeRunActionFail extends IWorkatoRecipeRunAction {
  error: string;
}

export interface IWorkatoRecipeRunActionSuccess extends IWorkatoRecipeRunAction {
  success: boolean;
}

export interface IWorkatoRecipeRunActionResponse {
  error: string;
  success: boolean;
}

export interface IWorkatoUpdateRecipeSuccess {
  recipeId: string;
  updatedRecipe: IWorkatoRecipe;
}

export type TRecipeStatus = 'running' | 'stopping' | 'updating';

export interface TRecipeDictionaryStatus {
  [key: string]: TRecipeStatus;
}
