import * as yup from 'yup';

const rCustomFieldLabel = /^[a-zA-Z0-9-_\s]+$/;

export const addFieldFormSchema = yup.object().shape({
  label: yup.string().trim().required().max(255).matches(rCustomFieldLabel, {
    message:
      'Custom field name is invalid. Only alphanumeric, dash and underscore symbols are allowed in the field name.',
    excludeEmptyString: true,
  }),
  required: yup.boolean(),
});
