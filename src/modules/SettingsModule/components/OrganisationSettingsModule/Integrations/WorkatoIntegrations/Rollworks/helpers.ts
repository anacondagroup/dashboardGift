import { Path } from 'react-hook-form';

import { TRollworksConfigurationForm } from '../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoRecipeField } from '../../../../../store/organisation/integrations/workato/recipes/recipes.types';

import { RollworksHSFieldsMap, RollworksSFFieldsMap } from './RollworksRecipe/RollworksConstants';

export const getRollworksFieldCodeByFormFieldName = (
  field: Path<TRollworksConfigurationForm>,
  isSF: boolean,
): string => {
  if (isSF) return RollworksSFFieldsMap[field];
  return RollworksHSFieldsMap[field];
};

export const mapFormToRollworksRecipeFields = (
  formValues: TRollworksConfigurationForm,
  getFieldCode: (formFieldName: keyof TRollworksConfigurationForm) => string,
): IWorkatoRecipeField[] =>
  (Object.keys(formValues) as Array<keyof typeof formValues>).map(formFieldName => ({
    code: getFieldCode(formFieldName),
    value: formValues[formFieldName].toString(),
  }));
