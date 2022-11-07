import { Path } from 'react-hook-form';

import { TDemandbaseConfigurationForm } from '../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoRecipeField } from '../../../../../store/organisation/integrations/workato/recipes/recipes.types';

import { DemandbaseFieldsMap } from './DemandbaseRecipe/DemandbaseConstants';

export const getDemandbaseFieldCodeByFormFieldName = (field: Path<TDemandbaseConfigurationForm>): string =>
  DemandbaseFieldsMap[field];

export const mapFormToDemandbaseRecipeFields = (
  formValues: TDemandbaseConfigurationForm,
  getFieldCode: (formFieldName: keyof TDemandbaseConfigurationForm) => string,
): IWorkatoRecipeField[] =>
  (Object.keys(formValues) as Array<keyof typeof formValues>).map(formFieldName => ({
    code: getFieldCode(formFieldName),
    value: formValues[formFieldName].toString(),
  }));
