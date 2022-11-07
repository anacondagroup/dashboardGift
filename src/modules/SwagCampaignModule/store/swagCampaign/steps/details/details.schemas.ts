import { array, boolean, number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  SwagDetailsFormFields,
  SwagNotificationStatus,
  SwagNotificationStatusRecipient,
  TSwagDetailsFormValues,
} from '../../swagCampaign.types';

export const campaignNameSchema = string().label('Campaign Name').default('').trim().required().min(3).max(255);

const teamSchema = number().label('Team').nullable().default(null).required();

const campaignOwnerSchema = number().label('Campaign Owner').nullable().default(null).required();

const giftRecipientCountrySchema = array().label('Gift Recipient Country').min(1).default([]).required();

const notificationTypeSchema = object().shape({
  [SwagNotificationStatusRecipient.Owner]: boolean().default(true),
});

const notificationsSchema = object().shape({
  [SwagNotificationStatus.GiftClaimed]: notificationTypeSchema,
});

export const detailsFormSchema = object().shape({
  [SwagDetailsFormFields.CampaignName]: campaignNameSchema,
  [SwagDetailsFormFields.Team]: teamSchema,
  [SwagDetailsFormFields.OwnerId]: campaignOwnerSchema,
  [SwagDetailsFormFields.CountryIds]: giftRecipientCountrySchema,
  [SwagDetailsFormFields.NotificationSettings]: notificationsSchema,
});

export const detailsFormDefaultValues = detailsFormSchema.getDefault() as TSwagDetailsFormValues;

export const detailsFormResolver = yupResolver(detailsFormSchema);
