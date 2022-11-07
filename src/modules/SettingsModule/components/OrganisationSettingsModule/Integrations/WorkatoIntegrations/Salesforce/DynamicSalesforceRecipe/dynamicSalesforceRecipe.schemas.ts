import * as yup from 'yup';

import {
  SalesforceIntegrationField,
  TSalesforceConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const salesforceSchema = yup.object().shape({
  [SalesforceIntegrationField.MemberStatus]: yup
    .string()
    .nullable()
    .default('')
    .required('Please fill out this required field'),
});

export const salesforceSchemaDefaultValues = salesforceSchema.getDefault() as TSalesforceConfigurationForm;
