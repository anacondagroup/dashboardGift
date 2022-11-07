import { array, boolean, number, object, string } from 'yup';
import { EntityId } from '@alycecom/utils';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  NotificationStatus,
  NotificationStatusRecipient,
  TNotificationSettings,
} from '../../prospectingCampaign.types';

export enum DetailsFormFields {
  Name = 'campaignName',
  Team = 'teamId',
  OwnerId = 'ownerId',
  CountryIds = 'countryIds',
  NotificationSettings = 'notificationSettings',
  CampaignInstruction = 'campaignInstruction',
  TeamMemberIds = 'teamMemberIds',
}

export type TDetailsFormValues = {
  [DetailsFormFields.Name]: string;
  [DetailsFormFields.Team]: EntityId;
  [DetailsFormFields.OwnerId]: EntityId;
  [DetailsFormFields.CountryIds]: number[];
  [DetailsFormFields.NotificationSettings]: TNotificationSettings;
  [DetailsFormFields.CampaignInstruction]: string | null;
  [DetailsFormFields.TeamMemberIds]: number[];
};

const campaignNameSchema = string().label('Campaign Name').default('').trim().required().min(3).max(255);

const teamSchema = number().label('Team').nullable().default(null).required();

const campaignOwnerSchema = number().label('Campaign Owner').nullable().default(null).required();

const giftRecipientCountrySchema = array().label('Gift Recipient Country').min(1).default([]).required();

const campaignInstructionSchema = string()
  .label('Campaign Instructions')
  .min(3)
  .max(255)
  .nullable()
  .default(null)
  .transform(value => value || null);

const teamMemberIdsSchema = array().label('Team Members').default([]).required();

const notificationTypeSchema = object().shape({
  [NotificationStatusRecipient.Owner]: boolean().default(true),
  [NotificationStatusRecipient.SendAs]: boolean().default(true),
  [NotificationStatusRecipient.Sender]: boolean().default(true),
});

const notificationsSchema = object().shape({
  [NotificationStatus.GiftViewed]: notificationTypeSchema,
  [NotificationStatus.GiftExpired]: notificationTypeSchema,
  [NotificationStatus.GiftClaimedOrDeclined]: notificationTypeSchema,
});

export const detailsFormSchema = object().shape({
  [DetailsFormFields.Name]: campaignNameSchema,
  [DetailsFormFields.Team]: teamSchema,
  [DetailsFormFields.OwnerId]: campaignOwnerSchema,
  [DetailsFormFields.CountryIds]: giftRecipientCountrySchema,
  [DetailsFormFields.NotificationSettings]: notificationsSchema,
  [DetailsFormFields.CampaignInstruction]: campaignInstructionSchema,
  [DetailsFormFields.TeamMemberIds]: teamMemberIdsSchema,
});

export const detailsFormDefaultValues = detailsFormSchema.getDefault() as TDetailsFormValues;

export const detailsFormResolver = yupResolver(detailsFormSchema);
