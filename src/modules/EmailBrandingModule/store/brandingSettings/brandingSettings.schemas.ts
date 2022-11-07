import { object, string, number } from 'yup';

import { EmailBrandingFields } from '../emailBranding.types';

const rHex = /^(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s]*[\d.]+%?\))$/i;
const colorFormatError = 'Wrong color format';

export const validationSchema = object().shape({
  [EmailBrandingFields.headerBackgroundColor]: string().label('Background Color').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.headerItemsColor]: string().label('Background Pattern Color').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.buttonColor]: string().label('CTA Button Color').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.buttonTextColor]: string().label('CTA Button Text').required().matches(rHex, {
    message: colorFormatError,
    excludeEmptyString: true,
  }),
  [EmailBrandingFields.companyLogoWidth]: number()
    .label('Min Logo Size')
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required()
    .positive()
    .integer()
    .min(50)
    .max(600),
  [EmailBrandingFields.headerItemsOpacity]: number()
    .label('Pattern Opacity')
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required()
    .positive()
    .min(0)
    .max(1),
  [EmailBrandingFields.privacyPolicyUrl]: string().label('Privacy Policy Url').required().url(),
  [EmailBrandingFields.footerCopyrightInscription]: string().label('Copyright Attribution').required().max(1000),
});
