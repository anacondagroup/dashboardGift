import * as yup from 'yup';

export const personalRightSettingsFormSchema = yup.object().shape({
  firstName: yup.string().label('First name').trim().required(),
  lastName: yup.string().label('Last name').trim().required(),
  email: yup.string().label('Email').trim().email().required(),
  choice: yup.string().label('Choice').required(),
  complianceAccepted: yup.boolean().oneOf([true], 'Confirmation is required'),
});
