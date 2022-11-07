import { object, string } from 'yup';

export enum SingleContactFormFields {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  Company = 'company',
}

export const CONTACT_FORM_ERRORS = {
  [SingleContactFormFields.FirstName]: {
    max: 'First name should be less than 256 chars',
  },
  [SingleContactFormFields.LastName]: {
    max: 'Last name should be less than 256 chars',
  },
  [SingleContactFormFields.Email]: {
    required: 'Email is required',
    max: 'Email should be less than 256 chars',
  },
  [SingleContactFormFields.Company]: {
    max: 'Company name should be less than 256 chars',
  },
};

export interface ISingleContactFormValues {
  [SingleContactFormFields.FirstName]: string;
  [SingleContactFormFields.LastName]: string;
  [SingleContactFormFields.Email]: string;
  [SingleContactFormFields.Company]: string;
}

const firstNameSchema = string()
  .default('')
  .trim()
  .max(255, CONTACT_FORM_ERRORS[SingleContactFormFields.FirstName].max);

const lastNameSchema = string().default('').trim().max(255, CONTACT_FORM_ERRORS[SingleContactFormFields.LastName].max);

const emailSchema = string()
  .default('')
  .trim()
  .email()
  .required(CONTACT_FORM_ERRORS[SingleContactFormFields.Email].required)
  .max(255, CONTACT_FORM_ERRORS[SingleContactFormFields.Email].max);

const companySchema = string().default('').trim().max(255, CONTACT_FORM_ERRORS[SingleContactFormFields.Company].max);

export const singleContactFormSchema = object().shape({
  [SingleContactFormFields.FirstName]: firstNameSchema,
  [SingleContactFormFields.LastName]: lastNameSchema,
  [SingleContactFormFields.Email]: emailSchema,
  [SingleContactFormFields.Company]: companySchema,
});
export const singleContactFormDefaultValues = singleContactFormSchema.getDefault() as ISingleContactFormValues;
