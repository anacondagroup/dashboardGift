import { pipe, prop, equals } from 'ramda';
import { createSelector, OutputSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../../store/root.types';
import { IWorkatoRecipe } from '../workato.types';
import { SlackFieldsMap } from '../../../../../components/OrganisationSettingsModule/Integrations/WorkatoIntegrations/Slack/DynamicSlackRecipe/dynamicSlackRecipeConstants';
import {
  customObjectRecipe,
  SixthSenseCustomObjectFieldsMap,
  SixthSenseStandardObjectFieldsMap,
} from '../../../../../components/OrganisationSettingsModule/Integrations/WorkatoIntegrations/6Sense/SixthSenseObjectRecipe/SixthSenseConstants';
import {
  DemandbaseIntegrationField,
  SalesforceIntegrationField,
  RollworksIntegrationField,
  SixthSenseIntegrationField,
  SlackIntegrationField,
  TDemandbaseConfigurationForm,
  TSalesforceConfigurationForm,
  TRollworksConfigurationForm,
} from '../picklists/picklists.types';
import { DemandbaseFieldsMap } from '../../../../../components/OrganisationSettingsModule/Integrations/WorkatoIntegrations/Demandbase/DemandbaseRecipe/DemandbaseConstants';
import { SalesforceFieldsMap } from '../../../../../components/OrganisationSettingsModule/Integrations/WorkatoIntegrations/Salesforce/DynamicSalesforceRecipe/salesforceRecipeConstants';
import {
  RollworksHSFieldsMap,
  RollworksSFFieldsMap,
  rollworksViaSalesforceRecipe,
} from '../../../../../components/OrganisationSettingsModule/Integrations/WorkatoIntegrations/Rollworks/RollworksRecipe/RollworksConstants';

import { TRecipesState } from './recipes.reducer';
import { TRecipeDictionaryStatus } from './recipes.types';

const getWorkatoRecipesState = (state: IRootState): TRecipesState =>
  state.settings.organisation.integrations.workato.recipes;

export const getWorkatoRecipesList = pipe(getWorkatoRecipesState, prop('list'));
const getRecipesStateStatus = pipe(getWorkatoRecipesState, prop('status'));
const getRecipesState = pipe(getWorkatoRecipesState, prop('recipeDictionaryStatus'));
export const getIsLoadingWorkatoRecipes = createSelector(getRecipesStateStatus, equals(StateStatus.Pending));

export const makeGetIfRecipesConfigFieldsFilled = (
  recipeId: string,
): OutputSelector<IRootState, boolean, (res: IWorkatoRecipe[]) => boolean> =>
  createSelector(getWorkatoRecipesList, recipes => {
    const recipeFields = recipes.find(recipe => recipe.id === recipeId)?.fields;
    if (!recipeFields) return true;
    return recipeFields.every(field => field.value !== '');
  });

export const makeGetIsRecipeActionLoading = (
  recipeId: string,
): OutputSelector<IRootState, boolean, (state: TRecipeDictionaryStatus) => boolean> =>
  createSelector(getRecipesState, state => !!state[recipeId]);

export const makeGetRecipeById = (
  recipeId: string,
): OutputSelector<IRootState, IWorkatoRecipe | undefined, (res: IWorkatoRecipe[]) => IWorkatoRecipe | undefined> =>
  createSelector(getWorkatoRecipesList, recipes => recipes.find(recipe => recipe.id === recipeId));

export const makeGetRecipeFieldsValueById = (
  recipeId: string,
): OutputSelector<
  IRootState,
  Record<string, string> | undefined,
  (res: IWorkatoRecipe) => Record<string, string> | undefined
> =>
  createSelector(makeGetRecipeById(recipeId), recipe =>
    recipe?.fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.code]: field.value,
      }),
      {},
    ),
  );

export const getIsCurrentIntegrationActive = createSelector(getWorkatoRecipesList, recipes =>
  recipes.some(recipe => recipe.running),
);

export const makeGetDefaultDynamicSlackRecipesFieldValues = (
  recipeId: string,
): OutputSelector<
  IRootState,
  Record<SlackIntegrationField, string> | undefined,
  (res: Record<SlackIntegrationField, string> | undefined) => Record<SlackIntegrationField, string> | undefined
> =>
  createSelector(makeGetRecipeFieldsValueById(recipeId), recipeFields => {
    if (!recipeFields) {
      return undefined;
    }
    return (Object.values(SlackIntegrationField) as SlackIntegrationField[]).reduce(
      (acc, formFieldName) => ({
        ...acc,
        [formFieldName]: recipeFields[SlackFieldsMap[formFieldName]],
      }),
      {} as Record<SlackIntegrationField, string>,
    );
  });

export const makeGetDefaultSixthSenseRecipeFieldValues = (
  recipeId: string,
): OutputSelector<
  IRootState,
  Record<SixthSenseIntegrationField, string> | undefined,
  (
    res: Record<SixthSenseIntegrationField, string> | undefined,
  ) => Record<SixthSenseIntegrationField, string> | undefined
> =>
  createSelector(makeGetRecipeFieldsValueById(recipeId), recipeFields => {
    const isCustomObject = recipeId === customObjectRecipe.id;
    const fieldsMap = isCustomObject ? SixthSenseCustomObjectFieldsMap : SixthSenseStandardObjectFieldsMap;

    if (!recipeFields) {
      return undefined;
    }
    return (Object.values(SixthSenseIntegrationField) as SixthSenseIntegrationField[]).reduce(
      (acc, formFieldName) => ({
        ...acc,
        [formFieldName]: recipeFields[fieldsMap[formFieldName]],
      }),
      {} as Record<SixthSenseIntegrationField, string>,
    );
  });

export const makeGetDefaultDemandbaseRecipeFieldValues = (
  recipeId: string,
): OutputSelector<
  IRootState,
  Record<DemandbaseIntegrationField, TDemandbaseConfigurationForm[DemandbaseIntegrationField]> | undefined,
  (
    res: Record<DemandbaseIntegrationField, string> | undefined,
  ) => Record<DemandbaseIntegrationField, TDemandbaseConfigurationForm[DemandbaseIntegrationField]> | undefined
> =>
  createSelector(makeGetRecipeFieldsValueById(recipeId), recipeFields => {
    if (!recipeFields) {
      return undefined;
    }
    return (Object.values(DemandbaseIntegrationField) as DemandbaseIntegrationField[]).reduce(
      (acc, formFieldName) => ({
        ...acc,
        [formFieldName]: recipeFields[DemandbaseFieldsMap[formFieldName]],
      }),
      {} as Record<DemandbaseIntegrationField, TDemandbaseConfigurationForm[DemandbaseIntegrationField]>,
    );
  });

export const makeGetDefaultSalesforceRecipeFieldValues = (
  recipeId: string,
): OutputSelector<
  IRootState,
  Record<SalesforceIntegrationField, TSalesforceConfigurationForm[SalesforceIntegrationField]> | undefined,
  (
    res: Record<SalesforceIntegrationField, string> | undefined,
  ) => Record<SalesforceIntegrationField, TSalesforceConfigurationForm[SalesforceIntegrationField]> | undefined
> =>
  createSelector(makeGetRecipeFieldsValueById(recipeId), recipeFields => {
    if (!recipeFields) {
      return undefined;
    }
    return (Object.values(SalesforceIntegrationField) as SalesforceIntegrationField[]).reduce(
      (acc, formFieldName) => ({
        ...acc,
        [formFieldName]: recipeFields[SalesforceFieldsMap[formFieldName]],
      }),
      {} as Record<SalesforceIntegrationField, TSalesforceConfigurationForm[SalesforceIntegrationField]>,
    );
  });

export const makeGetDefaultRollworksRecipeFieldValues = (
  recipeId: string,
): OutputSelector<
  IRootState,
  Record<RollworksIntegrationField, TRollworksConfigurationForm[RollworksIntegrationField]> | undefined,
  (
    res: Record<RollworksIntegrationField, string> | undefined,
  ) => Record<RollworksIntegrationField, TRollworksConfigurationForm[RollworksIntegrationField]> | undefined
> =>
  createSelector(makeGetRecipeFieldsValueById(recipeId), recipeFields => {
    if (!recipeFields) {
      return undefined;
    }

    const isSFObject = recipeId === rollworksViaSalesforceRecipe.id;
    const fieldsMap = isSFObject ? RollworksSFFieldsMap : RollworksHSFieldsMap;

    return (Object.values(RollworksIntegrationField) as RollworksIntegrationField[]).reduce(
      (acc, formFieldName) => ({
        ...acc,
        [formFieldName]: recipeFields[fieldsMap[formFieldName]],
      }),
      {} as Record<RollworksIntegrationField, TRollworksConfigurationForm[RollworksIntegrationField]>,
    );
  });
