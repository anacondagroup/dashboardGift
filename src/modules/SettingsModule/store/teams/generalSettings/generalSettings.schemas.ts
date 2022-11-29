import * as yup from 'yup';
import { equals, pipe } from 'ramda';

const rUrlProtocol = /^((https?|ftp):)?\/\//i;

export const complianceSchema = yup.object().shape({
  complianceIsRequired: yup.boolean().transform(pipe(String, equals('true'))),
  compliancePromptText: yup.string().when('complianceIsRequired', {
    is: true,
    then: yup
      .string()
      .nullable()
      .trim()
      .min(25, 'The compliance prompt text must be at least 25 characters')
      .max(1024, 'The compliance prompt text must not exceed 1024 characters')
      .required('Prompt message is required'),
    otherwise: yup.string(),
  }),
  complianceRevertText: yup
    .string()
    .transform(v => (v === null ? '' : v))
    .trim()
    .max(1024, 'The compliance revert text must not exceed 1024 characters'),
  complianceLink: yup
    .string()
    .transform(v => (v === null ? '' : v))
    .trim()
    .max(255, 'Link must not exceed 255 characters')
    .matches(rUrlProtocol, {
      message: 'Protocol http:// or https:// is missing in the link',
      excludeEmptyString: true,
    })
    .url('Link should contain a valid url'),
});
