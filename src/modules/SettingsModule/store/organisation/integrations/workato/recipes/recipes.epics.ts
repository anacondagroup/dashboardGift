import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import {
  handleError,
  handlers,
  ILegacyResponseError,
  IResponse,
  MessageType,
  TAnyResponseError,
} from '@alycecom/services';

import { IWorkatoRecipe } from '../workato.types';
import { fetchWorkatoConnectionsByIntegration } from '../connections/connections.actions';
import { fetchOrganizationSubscriptions } from '../subscription/subscription.actions';

import {
  executeWorkatoRecipeAction,
  fetchWorkatoRecipesByIntegration,
  runWorkatoRecipeAction,
  updateWorkatoRecipeFields,
} from './recipes.actions';
import { IWorkatoRecipeRunActionResponse } from './recipes.types';

export const workatoIntegrationRecipesByIntegrationEpic: Epic = (
  action$,
  state$,
  { apiGateway, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(fetchWorkatoRecipesByIntegration.pending),
    switchMap(({ payload: { integrationId } }) =>
      apiGateway.get(`/marketing/workato/integrations/${integrationId}/recipes`, null, true).pipe(
        mergeMap(({ data }: IResponse<IWorkatoRecipe[]>) => [
          fetchWorkatoRecipesByIntegration.fulfilled({ data, integrationId }),
          fetchOrganizationSubscriptions(),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              fetchWorkatoRecipesByIntegration.rejected(),
              fetchWorkatoConnectionsByIntegration.rejected(),
              (_: unknown, error: TAnyResponseError) =>
                showGlobalMessage({
                  type: MessageType.Error,
                  text: (error as ILegacyResponseError).message || 'Error fetching recipes',
                }),
            ),
          ),
        ),
      ),
    ),
  );

export const executeWorkatoRecipeActionEpic: Epic = action$ =>
  action$.pipe(
    ofType(executeWorkatoRecipeAction),
    map(({ payload }) => {
      const { recipeId, fields, action } = payload;
      if (fields) {
        return updateWorkatoRecipeFields(payload);
      }
      return runWorkatoRecipeAction({ recipeId, action });
    }),
  );

export const updateWorkatoRecipeFieldsEpic: Epic = (
  action$,
  state$,
  { apiGateway, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(updateWorkatoRecipeFields.pending),
    mergeMap(({ payload: { recipeId, action, fields } }) =>
      apiGateway.put(`/marketing/workato/recipes/${recipeId}`, { body: { fields } }, true).pipe(
        mergeMap(({ data }: IResponse<IWorkatoRecipe>) => [
          updateWorkatoRecipeFields.fulfilled(data),
          runWorkatoRecipeAction({ recipeId, action }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              updateWorkatoRecipeFields.rejected({ error: `Failed to ${action} recipe`, recipeId, action }),
              (_: unknown, error: TAnyResponseError) =>
                showGlobalMessage({
                  type: MessageType.Error,
                  text: (error as ILegacyResponseError).message || 'Error fetching recipes',
                }),
            ),
          ),
        ),
      ),
    ),
  );

export const runWorkatoRecipeActionEpic: Epic = (
  action$,
  state$,
  { apiGateway, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(runWorkatoRecipeAction.pending),
    mergeMap(({ payload: { recipeId, action } }) =>
      apiGateway.post(`/marketing/workato/recipes/${recipeId}/action`, { body: { action } }, true).pipe(
        mergeMap(({ data }: IResponse<IWorkatoRecipeRunActionResponse>) => {
          if (data.success) {
            return [
              runWorkatoRecipeAction.fulfilled({ action, success: data.success, recipeId }),
              showGlobalMessage({
                type: MessageType.Success,
                text: action === 'start' ? 'Recipe started successfully' : 'Recipe stopped successfully',
              }),
              fetchOrganizationSubscriptions(),
            ];
          }
          throw new Error(data.error);
        }),
        catchError(
          handleError(
            handlers.handleAnyError(
              runWorkatoRecipeAction.rejected({ error: `Failed to ${action} recipe`, recipeId, action }),
              showGlobalMessage({
                type: MessageType.Error,
                text: `Could not ${action} a recipe. Please contact Alyce Support team.`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

export const recipesEpics = [
  workatoIntegrationRecipesByIntegrationEpic,
  executeWorkatoRecipeActionEpic,
  updateWorkatoRecipeFieldsEpic,
  runWorkatoRecipeActionEpic,
];
