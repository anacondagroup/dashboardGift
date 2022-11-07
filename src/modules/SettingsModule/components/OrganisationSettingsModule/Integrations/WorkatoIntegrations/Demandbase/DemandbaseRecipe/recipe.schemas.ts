import * as yup from 'yup';

import {
  DemandbaseIntegrationField,
  TDemandbaseConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const demandbaseSchema = yup.object().shape({
  [DemandbaseIntegrationField.Stage]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [DemandbaseIntegrationField.Minutes]: yup
    .number()
    .transform((currentValue, originalValue) => (originalValue === '' ? null : currentValue))
    .default(null)
    .nullable()
    .positive()
    .integer('The value should be a whole number')
    .min(1, 'The value should be greater than 0')
    .typeError('Please specify a whole number')
    .required('Please fill out this required field'),
  [DemandbaseIntegrationField.JobTitles]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [DemandbaseIntegrationField.Campaign]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
});

export const demandbaseSchemaDefaultValues = demandbaseSchema.getDefault() as TDemandbaseConfigurationForm;
