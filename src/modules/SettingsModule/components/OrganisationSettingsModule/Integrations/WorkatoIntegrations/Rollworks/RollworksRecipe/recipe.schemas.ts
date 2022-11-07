import * as yup from 'yup';

import {
  RollworksIntegrationField,
  TRollworksConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const rollworksSchema = yup.object().shape({
  [RollworksIntegrationField.Account]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [RollworksIntegrationField.JourneyStage]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [RollworksIntegrationField.JobTitle]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [RollworksIntegrationField.Campaign]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
});

export const rollworksSchemaDefaultValues = rollworksSchema.getDefault() as TRollworksConfigurationForm;
