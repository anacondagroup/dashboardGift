import { boolean, object, string } from 'yup';

export const buildValidationSchema = charsLimit =>
  object().shape({
    subject: string()
      .trim()
      .min(3, 'The subject should be longer than 2 characters')
      .max(255, 'The subject should not exceed 255 characters'),
    allowEditTemplate: boolean().default(true),
    message: string()
      .trim()
      .min(11, 'The message should be longer than 10 characters')
      .max(charsLimit, `The message should not exceed ${charsLimit} characters`),
  });
