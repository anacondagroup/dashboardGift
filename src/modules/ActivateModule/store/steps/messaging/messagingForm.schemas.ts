import { boolean, object, string } from 'yup';

import { defaultHeader, defaultMessage, defaultMetaHeader, defaultMetaDescription } from './messaging.constants';
import {
  IRedemptionPopUp,
  LandingPageContents,
  PostGiftActions,
  TExpirePopupData,
  TRecipientMetaData,
} from './messaging.types';

export enum MessagingFormFields {
  PageHeader = 'pageHeader',

  LandingPageContentType = 'landingPageContentType',
  PageBody = 'pageBody',
  EmbedVideoUrl = 'embedVideoUrl',
  Vidyard = 'vidyard',

  PostGiftAction = 'postGiftAction',
  PostGiftRedirect = 'postGiftRedirect',
  ShowGiftRedemptionPopUp = 'showGiftRedemptionPopUp',
  RedemptionPopUp = 'redemptionPopUp',
  ExpirePopup = 'expirePopUp',
  RecipientMeta = 'recipientMeta',
}

const allowedURL = /^https:\/\/(www.youtube.com\/embed\/|fast.wistia.net\/embed\/|fast.wistia.com\/embed\/|play.vidyard.com\/|player.vimeo.com\/).*/i;

export enum RedemptionPopUpFields {
  Header = 'header',
  Message = 'message',
  ButtonLabel = 'buttonLabel',
}

export enum VidyardFormFields {
  VidyardImage = 'vidyardImage',
  VidyardVideo = 'vidyardVideo',
}

export enum ExpirePopupFields {
  Header = 'header',
  Message = 'message',
}

export enum RecipientMetaFields {
  Header = 'header',
  Description = 'description',
}

export interface IMessageFormValues {
  [MessagingFormFields.PageHeader]: string;

  [MessagingFormFields.PageBody]: string | null;
  [MessagingFormFields.Vidyard]: IVidyardFormValues | null;
  [MessagingFormFields.EmbedVideoUrl]: string | null;

  [MessagingFormFields.PostGiftAction]: PostGiftActions;
  [MessagingFormFields.PostGiftRedirect]: string | null;
  [MessagingFormFields.ShowGiftRedemptionPopUp]: boolean;
  [MessagingFormFields.RedemptionPopUp]: IRedemptionPopUp | null;
  [MessagingFormFields.LandingPageContentType]: LandingPageContents;
  [MessagingFormFields.ExpirePopup]: TExpirePopupData | null;
  [MessagingFormFields.RecipientMeta]: TRecipientMetaData | null;
}

export interface IVidyardFormValues {
  [VidyardFormFields.VidyardVideo]: string | null;
  [VidyardFormFields.VidyardImage]: string | null;
}

export const MESSAGING_FORM_ERRORS = {
  [MessagingFormFields.PageHeader]: {
    required: 'Messaging header is required',
    min: 'Messaging header should be at least 1 characters',
    max: 'Messaging header should be no more than 70 chars',
  },
  [MessagingFormFields.PageBody]: {
    required: 'Message body must be filled in',
    min: 'Messaging body should be at least 1 characters',
    max: 'Messaging body should be no more than 560 chars',
  },
  [MessagingFormFields.PostGiftRedirect]: {
    required: 'Landing Page URL must be filled in',
    url: 'Should be a valid URL',
  },
  [MessagingFormFields.EmbedVideoUrl]: {
    required: 'Video URL must be filled in',
    url: 'Should be a valid URL',
  },
};

export const REDEMPTION_POP_UP_ERRORS = {
  [RedemptionPopUpFields.Header]: {
    required: 'CTA header is required',
    min: 'CTA header should be at least 1 characters',
    max: 'CTA header should be no more than 50 chars',
  },
  [RedemptionPopUpFields.Message]: {
    required: 'CTA message text is required',
    min: 'CTA message text should be at least 1 characters',
    max: 'CTA message text should be no more than 300 chars',
  },
  [RedemptionPopUpFields.ButtonLabel]: {
    required: 'CTA button text is required',
    min: 'CTA button text should be at least 1 characters',
    max: 'CTA button text should be no more than 20 chars',
  },
};

export const redemptionPopUpFormSchema = object({
  [RedemptionPopUpFields.Header]: string()
    .default('')
    .trim()
    .required(REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.Header].required)
    .min(1, REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.Header].min)
    .max(50, REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.Header].max)
    .nullable(),
  [RedemptionPopUpFields.Message]: string()
    .nullable()
    .default('')
    .trim()
    .required(REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.Message].required)
    .min(1, REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.Message].min)
    .max(300, REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.Message].max),
  [RedemptionPopUpFields.ButtonLabel]: string()
    .default('')
    .trim()
    .required(REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.ButtonLabel].required)
    .min(1, REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.ButtonLabel].min)
    .max(20, REDEMPTION_POP_UP_ERRORS[RedemptionPopUpFields.ButtonLabel].max)
    .nullable(),
});

export const vidyardFormSchema = object({
  [VidyardFormFields.VidyardVideo]: string().url().required(),
  [VidyardFormFields.VidyardImage]: string().url().required(),
});

export const expirePopupSchema = object({
  [ExpirePopupFields.Header]: string().label('Header').required().default(defaultHeader).min(1).max(55),
  [ExpirePopupFields.Message]: string().label('Message').required().default(defaultMessage).min(10).max(250),
});

export const recipientMetaSchema = object({
  [RecipientMetaFields.Header]: string().label('Header').required().default(defaultMetaHeader).min(1).max(55),
  [RecipientMetaFields.Description]: string()
    .label('Description')
    .required()
    .default(defaultMetaDescription)
    .min(10)
    .max(250),
});

const messagingFormSchemas = object({
  [MessagingFormFields.PageHeader]: string()
    .default('')
    .trim()
    .required(MESSAGING_FORM_ERRORS[MessagingFormFields.PageHeader].required)
    .min(1, MESSAGING_FORM_ERRORS[MessagingFormFields.PageHeader].min)
    .max(70, MESSAGING_FORM_ERRORS[MessagingFormFields.PageHeader].max),

  [MessagingFormFields.LandingPageContentType]: string().default(LandingPageContents.Text).required(),

  [MessagingFormFields.PageBody]: string()
    .nullable()
    .default(null)
    .when(MessagingFormFields.LandingPageContentType, {
      is: LandingPageContents.Text,
      then: string()
        .nullable()
        .trim()
        .required(MESSAGING_FORM_ERRORS[MessagingFormFields.PageBody].required)
        .min(1, MESSAGING_FORM_ERRORS[MessagingFormFields.PageBody].min)
        .max(560, MESSAGING_FORM_ERRORS[MessagingFormFields.PageBody].max),
    }),

  [MessagingFormFields.EmbedVideoUrl]: string()
    .nullable()
    .default(null)
    .when(MessagingFormFields.LandingPageContentType, {
      is: LandingPageContents.EmbedVideo,
      then: string()
        .nullable()
        .trim()
        .matches(allowedURL, 'You have entered an unsupported URL format or video platform')
        .required(MESSAGING_FORM_ERRORS[MessagingFormFields.EmbedVideoUrl].required),
    }),

  [MessagingFormFields.Vidyard]: object().nullable().default(null).when(MessagingFormFields.LandingPageContentType, {
    is: LandingPageContents.Vidyard,
    then: vidyardFormSchema.required(),
  }),

  [MessagingFormFields.PostGiftAction]: string().required().default(PostGiftActions.NoCta),

  [MessagingFormFields.PostGiftRedirect]: string()
    .nullable()
    .default(null)
    .when(MessagingFormFields.PostGiftAction, {
      is: PostGiftActions.Redirect,
      then: string()
        .nullable()
        .required(MESSAGING_FORM_ERRORS[MessagingFormFields.PostGiftRedirect].required)
        .url(MESSAGING_FORM_ERRORS[MessagingFormFields.PostGiftRedirect].url),
    }),

  [MessagingFormFields.ShowGiftRedemptionPopUp]: boolean().default(false),

  [MessagingFormFields.RedemptionPopUp]: object()
    .nullable()
    .default(null)
    .when([MessagingFormFields.PostGiftAction, MessagingFormFields.ShowGiftRedemptionPopUp], {
      is: (postGiftAction: PostGiftActions, isGiftRedemptionPopUpShowed: boolean) =>
        postGiftAction === PostGiftActions.Redirect && isGiftRedemptionPopUpShowed,
      then: redemptionPopUpFormSchema.required(),
    }),

  [MessagingFormFields.ExpirePopup]: expirePopupSchema,
  [MessagingFormFields.RecipientMeta]: recipientMetaSchema,
});

export const messagingFormDefaultValues = messagingFormSchemas.getDefault() as IMessageFormValues;

export default messagingFormSchemas;
