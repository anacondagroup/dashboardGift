import { yupResolver } from '@hookform/resolvers/yup';
import { number, object, string } from 'yup';

import { CodesType, minValidDateForCodes, physicalCodesAmount } from '../codes.constants';
import { CodesSettingsDataFields, CodesSettingsLabels, TDigitalCodesFormValues } from '../codes.types';

const codeFormatSchema = string().default(CodesType.Physical).required();

const codesBatchNameSchema = string()
  .label(`${CodesSettingsLabels.OrderName}`)
  .trim()
  .default('')
  .when([CodesSettingsDataFields.CodeFormat], {
    is: (codesFormat: string) => codesFormat === CodesType.Digital,
    then: string().min(3).max(255).required(),
  });

const codesAmountSchema = number()
  .label(`${CodesSettingsLabels.TotalCodes}`)
  .default(physicalCodesAmount[0])
  .when([CodesSettingsDataFields.CodeFormat], {
    is: (codesFormat: string) => codesFormat === CodesType.Digital,
    then: number().min(1).max(1000).required(),
  });

const codesExpirationDateSchema = string()
  .label(`${CodesSettingsLabels.ExpireTime}`)
  .default(minValidDateForCodes)
  .when([CodesSettingsDataFields.CodeFormat], {
    is: (codeFormat: string) => codeFormat === CodesType.Digital,
    then: string().required(),
  });

const DigitalCodesSettingsSchema = object().shape({
  [CodesSettingsDataFields.CodesBatchName]: codesBatchNameSchema,
  [CodesSettingsDataFields.CodesAmount]: codesAmountSchema,
  [CodesSettingsDataFields.CodesExpirationDate]: codesExpirationDateSchema,
  [CodesSettingsDataFields.CodeFormat]: codeFormatSchema,
});

export const digitalCodesSettingsResolver = yupResolver(DigitalCodesSettingsSchema);
export const digitalCodesSettingsDefaultValues = DigitalCodesSettingsSchema.getDefault() as TDigitalCodesFormValues;
