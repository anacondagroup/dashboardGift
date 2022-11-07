import { yupResolver } from '@hookform/resolvers/yup';
import { number, object, string } from 'yup';

import { CodesType, minValidDateForCodes, physicalCodesAmount } from '../codes.constants';
import {
  CodesSettingsDataFields,
  CodesSettingsLabels,
  DeliveryAddressDataFields,
  DeliveryAddressLabels,
  TPhysicalCardsFormValues,
} from '../codes.types';

const codesBatchNameSchema = string()
  .label(`${CodesSettingsLabels.OrderName}`)
  .default('')
  .trim()
  .min(3)
  .max(255)
  .required();

const codesAmountSchema = number()
  .label(`${CodesSettingsLabels.TotalCodes}`)
  .min(50)
  .max(1000)
  .default(physicalCodesAmount[0])
  .required();

const codesExpirationDateSchema = string()
  .label(`${CodesSettingsLabels.ExpireTime}`)
  .default(minValidDateForCodes)
  .required();

const contactNameSchema = string()
  .label(`${CodesSettingsLabels.ContactName}`)
  .default('')
  .trim()
  .min(3)
  .max(255)
  .required();

const addressLine1Schema = string()
  .label(`${DeliveryAddressLabels.AddressLine1}`)
  .default('')
  .trim()
  .min(6)
  .max(255)
  .required();

const addressLine2Schema = string().label(`${DeliveryAddressLabels.AddressLine2}`).nullable().default('').trim();

const citySchema = string().label(`${DeliveryAddressLabels.City}`).default('').trim().min(3).max(255).required();

const stateSchema = string().label(`${DeliveryAddressLabels.State}`).default('').required();

const zipCodeSchema = string().label(`${DeliveryAddressLabels.ZipCode}`).default('').trim().min(3).max(6).required();

const countrySchema = number().label(`${DeliveryAddressLabels.Country}`).default(1).required();

const codeFormatSchema = string().default(CodesType.Physical).required();

const deliveryAddressSchema = object().shape({
  [DeliveryAddressDataFields.AddressLine1]: addressLine1Schema,
  [DeliveryAddressDataFields.AddressLine2]: addressLine2Schema,
  [DeliveryAddressDataFields.City]: citySchema,
  [DeliveryAddressDataFields.State]: stateSchema,
  [DeliveryAddressDataFields.CountryId]: countrySchema,
  [DeliveryAddressDataFields.Zip]: zipCodeSchema,
});

const PhysicalCardsSettingsSchema = object().shape({
  [CodesSettingsDataFields.CodesBatchName]: codesBatchNameSchema,
  [CodesSettingsDataFields.CodesAmount]: codesAmountSchema,
  [CodesSettingsDataFields.CodesExpirationDate]: codesExpirationDateSchema,
  [CodesSettingsDataFields.ContactName]: contactNameSchema,
  [CodesSettingsDataFields.CodeFormat]: codeFormatSchema,
  [CodesSettingsDataFields.DeliveryAddress]: deliveryAddressSchema,
});

export const physicalCardsSettingsResolver = yupResolver(PhysicalCardsSettingsSchema);
export const physicalCardsSettingsDefaultValues = PhysicalCardsSettingsSchema.getDefault() as TPhysicalCardsFormValues;
