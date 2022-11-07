import * as yup from 'yup';

import {
  SlackIntegrationField,
  TSlackConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const slackSchema = yup.object().shape({
  [SlackIntegrationField.Channel]: yup.string().nullable().default('').required('Please fill out this required field'),
  [SlackIntegrationField.GiftStatus]: yup
    .string()
    .nullable()
    .default('')
    .required('Please fill out this required field'),
});

export const slackSchemaDefaultValues = slackSchema.getDefault() as TSlackConfigurationForm;
