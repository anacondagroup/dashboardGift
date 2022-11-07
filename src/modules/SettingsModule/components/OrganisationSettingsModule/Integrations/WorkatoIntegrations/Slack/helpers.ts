import { Path } from 'react-hook-form';

import { TSlackConfigurationForm } from '../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoRecipeField } from '../../../../../store/organisation/integrations/workato/recipes/recipes.types';

import { SlackFieldsMap } from './DynamicSlackRecipe/dynamicSlackRecipeConstants';

export const getSlackFieldCodeByFormFieldName = (field: Path<TSlackConfigurationForm>): string => SlackFieldsMap[field];

export const mapFormToSlackRecipeFields = (
  formValues: TSlackConfigurationForm,
  getFieldCode: (formFieldName: keyof TSlackConfigurationForm) => string,
): IWorkatoRecipeField[] =>
  (Object.keys(formValues) as Array<keyof typeof formValues>).map(formFieldName => ({
    code: getFieldCode(formFieldName),
    value: formValues[formFieldName],
  }));
