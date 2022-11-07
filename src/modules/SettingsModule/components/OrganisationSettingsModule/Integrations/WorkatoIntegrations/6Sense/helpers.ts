import { Path } from 'react-hook-form';

import { TSixthSenseConfigurationForm } from '../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoRecipeField } from '../../../../../store/organisation/integrations/workato/recipes/recipes.types';

import {
  SixthSenseCustomObjectFieldsMap,
  SixthSenseStandardObjectFieldsMap,
} from './SixthSenseObjectRecipe/SixthSenseConstants';

export const getSixthSenseFieldCodeByFormFieldName = (
  field: Path<TSixthSenseConfigurationForm>,
  isCustom: boolean,
): string => {
  if (isCustom) {
    return SixthSenseCustomObjectFieldsMap[field];
  }
  return SixthSenseStandardObjectFieldsMap[field];
};

export const mapFormToSixthSenseRecipeFields = (
  formValues: TSixthSenseConfigurationForm,
  getFieldCode: (formFieldName: keyof TSixthSenseConfigurationForm) => string,
): IWorkatoRecipeField[] =>
  (Object.keys(formValues) as Array<keyof typeof formValues>).map(formFieldName => ({
    code: getFieldCode(formFieldName),
    value: formValues[formFieldName],
  }));
