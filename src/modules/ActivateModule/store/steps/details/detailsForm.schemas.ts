import { array, boolean, number, NumberSchema, BooleanSchema, object, string } from 'yup';
import moment from 'moment';
import { EntityId } from '@alycecom/utils';
import { REQUEST_DATE_FORMAT } from '@alycecom/ui';
import {
  CAMPAIGN_PURPOSE_ERRORS,
  CampaignPurposeFields,
  campaignPurposeRequiredSchema,
  campaignPurposeSchema,
  ICampaignPurposeValues,
} from '@alycecom/modules';

import { DetailsConstants } from '../../../constants/details.constants';
import {
  ClaimType as ClaimTypeEnum,
  NotificationStatus,
  NotificationStatusRecipient,
  TClaimType,
  TNotificationSettings,
} from '../../activate.types';

export const minimumValidDate = moment().add(1, 'day').format(REQUEST_DATE_FORMAT);

enum BaseDetailsFormFields {
  Name = 'campaignName',
  Team = 'teamId',
  TeamOwner = 'ownerId',
  CountryIds = 'countryIds',
  ExpirationDate = 'expirationDate',
  SendAsOption = 'sendAsOption',
  SendAsId = 'sendAsId',
  NotificationSettings = 'notificationSettings',
  ClaimType = 'claimType',
  FreeClaims = 'freeClaims',
}

export const DetailsFormFields = {
  ...BaseDetailsFormFields,
  ...CampaignPurposeFields,
};

export const DETAILS_FORM_ERRORS = {
  [DetailsFormFields.Name]: {
    required: 'Campaign name is required',
    min: 'Campaign name should be at least 3 characters',
    max: 'Campaign name should be less than 256 chars',
  },
  [DetailsFormFields.Team]: {
    required: 'Assigned team is required',
  },
  [DetailsFormFields.TeamOwner]: {
    required: 'Campaign owner is required',
  },
  [DetailsFormFields.CountryIds]: {
    required: 'Gift recipient country is required',
  },
  [DetailsFormFields.SendAsOption]: {
    required: 'You should choose option from Gift link settings',
  },
  [DetailsFormFields.SendAsId]: {
    required: 'You should specify Send-As Person',
  },
  [DetailsFormFields.FreeClaims]: {
    max: `Can't exceed max. limit of 100 claims`,
  },
  ...CAMPAIGN_PURPOSE_ERRORS,
};

export type IDetailsFormValues = {
  [DetailsFormFields.Name]: string;
  [DetailsFormFields.Team]: EntityId;
  [DetailsFormFields.TeamOwner]: EntityId;
  [DetailsFormFields.CountryIds]: number[];
  [DetailsFormFields.ExpirationDate]: string | null;
  [DetailsFormFields.SendAsOption]: DetailsConstants | null;
  [DetailsFormFields.SendAsId]: EntityId | null;
  [DetailsFormFields.NotificationSettings]: TNotificationSettings;
  [DetailsFormFields.ClaimType]: TClaimType;
  [DetailsFormFields.FreeClaims]: number | null;
} & ICampaignPurposeValues;

const notificationTypeSchema = object().shape({
  [NotificationStatusRecipient.Owner]: boolean().default(true),
  [NotificationStatusRecipient.SendAs]: boolean().default(false),
});

const notificationOnlyOwnerSchema = boolean()
  .default(true)
  .when('$isFreeClaimEnabled', (isFreeClaimEnabled: boolean, schema: BooleanSchema) =>
    isFreeClaimEnabled ? schema.default(false) : schema,
  );

const notificationReachedClaimLimitsTypeSchema = object().shape({
  [NotificationStatusRecipient.Owner]: notificationOnlyOwnerSchema,
  [NotificationStatusRecipient.SendAs]: boolean().default(false),
});

const notificationsSchema = object().shape({
  [NotificationStatus.GiftViewed]: notificationTypeSchema,
  [NotificationStatus.GiftExpired]: notificationTypeSchema,
  [NotificationStatus.GiftClaimedOrDeclined]: notificationTypeSchema,
  [NotificationStatus.ReachedClaimLimits]: notificationReachedClaimLimitsTypeSchema,
});

export type TUpdateDetailsFormValues = Pick<
  IDetailsFormValues,
  | BaseDetailsFormFields.Name
  | BaseDetailsFormFields.TeamOwner
  | BaseDetailsFormFields.ExpirationDate
  | BaseDetailsFormFields.NotificationSettings
  | BaseDetailsFormFields.SendAsOption
  | BaseDetailsFormFields.SendAsId
  | BaseDetailsFormFields.FreeClaims
  | BaseDetailsFormFields.ClaimType
> &
  ICampaignPurposeValues;

export type TTotalClaimsFields = {
  [BaseDetailsFormFields.FreeClaims]: number;
};

export const totalClaimsSchema = object().shape({
  [BaseDetailsFormFields.FreeClaims]: number()
    .nullable()
    .default(0)
    .required()
    .label('Total Claims')
    .max(100)
    .when('$claimedGiftsCount', (giftsCount: number | undefined, schema: NumberSchema<number | null | undefined>) =>
      typeof giftsCount === 'number' ? schema.min(giftsCount) : schema,
    ),
});

const campaignNameSchema = string()
  .default('')
  .trim()
  .required(DETAILS_FORM_ERRORS[DetailsFormFields.Name].required)
  .min(3, DETAILS_FORM_ERRORS[DetailsFormFields.Name].min)
  .max(255, DETAILS_FORM_ERRORS[DetailsFormFields.Name].max);

const teamSchema = number()
  .nullable()
  .label('Assigned Team')
  .required(DETAILS_FORM_ERRORS[DetailsFormFields.Team].required);

const teamOwnerSchema = number()
  .label('Campaign Owner')
  .required(DETAILS_FORM_ERRORS[DetailsFormFields.TeamOwner].required);

const countries = array()
  .label('Gift Recipient Country')
  .min(1)
  .default([])
  .required(DETAILS_FORM_ERRORS[DetailsFormFields.CountryIds].required);

const expirationDate = string()
  .default(null)
  .nullable()
  .test('min', 'Expiration date is invalid', value => {
    if (!value) {
      return true;
    }
    return moment(value).isSameOrAfter(moment(minimumValidDate));
  });

const claimTypeSchema = string().oneOf(Object.values(ClaimTypeEnum)).default(ClaimTypeEnum.PreApproved);
const freeClaimsSchema = number().label('Total Claims').nullable().default(null).min(0).max(100);

const sendAsOption = string()
  .default(DetailsConstants.Single)
  .label('Gift Link Settings')
  .when('$isMultipleLinksAvailable', {
    is: true,
    then: string().required(DETAILS_FORM_ERRORS[DetailsFormFields.SendAsOption].required),
  });

const sendAsId = number()
  .default(null)
  .label('Send-As Person')
  .nullable()
  .when([DetailsFormFields.SendAsOption, '$isMultipleLinksAvailable'], {
    is: (sendAsOptionField: DetailsConstants, isMultipleLinksAvailable: boolean) =>
      isMultipleLinksAvailable && sendAsOptionField === DetailsConstants.Single,
    then: number().required(DETAILS_FORM_ERRORS[DetailsFormFields.SendAsId].required),
  });

export const fullDetailsFormSchema = object().shape({
  [DetailsFormFields.Name]: campaignNameSchema,
  [DetailsFormFields.Team]: teamSchema,
  [DetailsFormFields.TeamOwner]: teamOwnerSchema,
  [DetailsFormFields.CountryIds]: countries,
  [DetailsFormFields.ExpirationDate]: expirationDate,
  [DetailsFormFields.SendAsOption]: sendAsOption,
  [DetailsFormFields.SendAsId]: sendAsId,
  [DetailsFormFields.NotificationSettings]: notificationsSchema,
  [DetailsFormFields.ClaimType]: claimTypeSchema,
  [DetailsFormFields.FreeClaims]: freeClaimsSchema,
  ...campaignPurposeRequiredSchema.fields,
});

export const detailsFormDefaultValues = fullDetailsFormSchema.getDefault() as IDetailsFormValues;

export const updateDetailsFormSchema = object().shape({
  [DetailsFormFields.Name]: campaignNameSchema,
  [DetailsFormFields.TeamOwner]: teamOwnerSchema,
  [DetailsFormFields.ExpirationDate]: expirationDate,
  [DetailsFormFields.SendAsOption]: sendAsOption,
  [DetailsFormFields.SendAsId]: sendAsId,
  [DetailsFormFields.NotificationSettings]: notificationsSchema,
  ...campaignPurposeSchema.fields,
});

export const updateDetailsFormDefaultValues = fullDetailsFormSchema.getDefault() as TUpdateDetailsFormValues;
