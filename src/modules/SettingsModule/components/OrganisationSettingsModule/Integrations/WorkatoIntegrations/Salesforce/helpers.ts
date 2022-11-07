import { Path } from 'react-hook-form';

import { TSalesforceConfigurationForm } from '../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoRecipeField } from '../../../../../store/organisation/integrations/workato/recipes/recipes.types';

import { SalesforceFieldsMap } from './DynamicSalesforceRecipe/salesforceRecipeConstants';

export const getSalesforceFieldCodeByFormFieldName = (field: Path<TSalesforceConfigurationForm>): string =>
  SalesforceFieldsMap[field];

export const mapFormToSalesforceRecipeFields = (
  formValues: TSalesforceConfigurationForm,
  getFieldCode: (formFieldName: keyof TSalesforceConfigurationForm) => string,
): IWorkatoRecipeField[] =>
  (Object.keys(formValues) as Array<keyof typeof formValues>).map(formFieldName => ({
    code: getFieldCode(formFieldName),
    value: formValues[formFieldName],
  }));
