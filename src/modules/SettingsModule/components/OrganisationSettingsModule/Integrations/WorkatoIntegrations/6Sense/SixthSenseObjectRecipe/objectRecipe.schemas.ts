import * as yup from 'yup';

import {
  SixthSenseIntegrationField,
  TSixthSenseConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const sixthSenseSchema = yup.object().shape({
  [SixthSenseIntegrationField.Segment]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [SixthSenseIntegrationField.Stage]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [SixthSenseIntegrationField.JobTitles]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
  [SixthSenseIntegrationField.Campaign]: yup
    .string()
    .nullable()
    .default('')
    .trim()
    .required('Please fill out this required field'),
});

export const sixthSenseSchemaDefaultValues = sixthSenseSchema.getDefault() as TSixthSenseConfigurationForm;
