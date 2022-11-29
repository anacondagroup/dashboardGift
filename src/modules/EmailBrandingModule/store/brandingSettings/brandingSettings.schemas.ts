import { object, string, number } from 'yup';

import { EmailBrandingFields, IBrandingSettings } from '../emailBranding.types';

const rHex = /^(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s]*[\d.]+%?\))$/i;
const colorFormatError = 'Wrong color format';

export const validationSchema = object().shape({
  [EmailBrandingFields.headerBackgroundColor]: string().label('Background Color').default('').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.headerItemsColor]: string()
    .label('Background Pattern Color')
    .default('')
    .required()
    .matches(rHex, {
      message: colorFormatError,
      excludeEmptyString: true,
    }),
  [EmailBrandingFields.buttonColor]: string().label('CTA Button Color').default('').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.buttonTextColor]: string().label('CTA Button Text').default('').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.companyLogoWidth]: number()
    .label('Min Logo Size')
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required()
    .positive()
    .integer()
    .default(50)
    .min(50)
    .max(600),
  [EmailBrandingFields.headerItemsOpacity]: number()
    .label('Pattern Opacity')
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required()
    .positive()
    .default(0)
    .min(0)
    .max(1),
  [EmailBrandingFields.privacyPolicyUrl]: string().label('Privacy Policy Link').default('').url(),
  [EmailBrandingFields.footerCopyrightInscription]: string().label('Copyright Attribution').default('').max(1000),
  [EmailBrandingFields.preferencesUrl]: string().label('Manage Preferences Link').default('').url(),
  [EmailBrandingFields.unsubscribeUrl]: string().label('Unsubscribe Link').default('').url(),
});

export const brandingSettingsDefaultValue = validationSchema.getDefault() as Partial<IBrandingSettings>;
