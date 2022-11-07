import { IResponse } from '@alycecom/services';

export enum CodesDataFields {
  TypeCodes = 'typeCodes',
}

export enum CodesSettingsDataFields {
  CodesBatchName = 'codesBatchName',
  CodesAmount = 'codesAmount',
  CodesExpirationDate = 'codesExpirationDate',
  ContactName = 'contactName',
  CodeFormat = 'codeFormat',
  DeliveryAddress = 'deliveryAddress',
}

export enum DeliveryAddressDataFields {
  AddressLine1 = 'addressLine1',
  AddressLine2 = 'addressLine2',
  State = 'state',
  Zip = 'zip',
  City = 'city',
  CountryId = 'countryId',
}

export enum CardsDesignDataFields {
  CardLogo = 'cardLogo',
  CardType = 'cardType',
  CardHexColor = 'cardHexColor',
  CardCmykColor = 'cardCmykColor',
  CardCopyFirstLine = 'cardCopyFirstLine',
  CardCopySecondLine = 'cardCopySecondLine',
  CardCopyThirdLine = 'cardCopyThirdLine',
  File = 'file',
}

export enum CardCmykColorFields {
  Cyan = 'c',
  Magenta = 'm',
  Yellow = 'y',
  Key = 'k',
}

export enum CardCopyLinesFields {
  Line1 = 'line1',
  Line2 = 'line2',
  Line3 = 'line3',
}

export enum CodesSettingsLabels {
  OrderName = 'Order Name',
  TotalCodes = 'Total Codes',
  ExpireTime = 'Expiration date',
  AmountCards = 'Select amount of cards',
  ContactName = 'Contact Name',
  CodeFormat = 'Code Format',
}

export enum DeliveryAddressLabels {
  AddressLine1 = 'Street Address',
  AddressLine2 = 'Apt / Suite / Other',
  City = 'City',
  State = 'State / Province',
  Country = 'Country',
  ZipCode = 'Zip Code',
}

export enum CardsDesignLabels {
  CardLogo = 'Card Logo',
  CardStyle = 'Card Style',
  CardColor = 'Card Color',
  CardHexColor = 'Hexa Color',
  Cyan = 'C',
  Magenta = 'M',
  Yellow = 'Y',
  Key = 'K',
  CardCopy = 'Card Copy',
  Line1 = 'Line 1',
  Line2 = 'Line 2',
  Line3 = 'Line 3',
}

export type TCardCopyLines = {
  line1: string;
  line2: string;
  line3: string;
};

export type TDeliveryAddressFormValues = {
  [DeliveryAddressDataFields.AddressLine1]: string;
  [DeliveryAddressDataFields.AddressLine2]: string;
  [DeliveryAddressDataFields.State]: string;
  [DeliveryAddressDataFields.Zip]: string;
  [DeliveryAddressDataFields.City]: string;
  [DeliveryAddressDataFields.CountryId]: number;
};

export type TCardCmykColorFormValues = {
  [CardCmykColorFields.Cyan]: number;
  [CardCmykColorFields.Magenta]: number;
  [CardCmykColorFields.Yellow]: number;
  [CardCmykColorFields.Key]: number;
};

export type TDigitalCodesFormValues = {
  [CodesSettingsDataFields.CodesBatchName]: string;
  [CodesSettingsDataFields.CodesAmount]: number;
  [CodesSettingsDataFields.CodesExpirationDate]: string;
  [CodesSettingsDataFields.CodeFormat]: string;
};

export type TPhysicalCardsFormValues = {
  [CodesSettingsDataFields.CodesBatchName]: string;
  [CodesSettingsDataFields.CodesAmount]: number;
  [CodesSettingsDataFields.CodesExpirationDate]: string;
  [CodesSettingsDataFields.ContactName]: string;
  [CodesSettingsDataFields.CodeFormat]: string;
  [CodesSettingsDataFields.DeliveryAddress]: TDeliveryAddressFormValues;
};

export type TCardsDesignFormValues = {
  [CardsDesignDataFields.CardLogo]: string;
  [CardsDesignDataFields.CardType]: string;
  [CardsDesignDataFields.CardHexColor]: string;
  [CardsDesignDataFields.CardCmykColor]: TCardCmykColorFormValues;
  [CardsDesignDataFields.CardCopyFirstLine]: string;
  [CardsDesignDataFields.CardCopySecondLine]: string;
  [CardsDesignDataFields.CardCopyThirdLine]: string;
  [CardsDesignDataFields.File]: string;
};

export type TCreateSwagCodesListResponse = IResponse<{ campaignId: number; orderId: number }>;
