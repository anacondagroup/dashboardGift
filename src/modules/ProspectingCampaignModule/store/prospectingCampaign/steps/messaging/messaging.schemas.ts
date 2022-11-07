import { AnySchema, boolean, object, string, StringSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { MessageVideoType, RedemptionAfterClaimAction, TProspectingMessaging } from '../../prospectingCampaign.types';

export enum MessagingStepFields {
  MessageData = 'messageData',
  RedemptionData = 'redemptionData',
  VideoData = 'videoData',
}

export enum MessageDataFields {
  Override = 'overrideEnabled',
  Header = 'header',
  Message = 'message',
}

export enum RedemptionDataFields {
  AfterClaimAction = 'afterClaimAction',
  AfterClaimRedirectUrl = 'afterClaimRedirectUrl',
  RedemptionPopupEnabled = 'redemptionPopupEnabled',
  RedemptionPopup = 'redemptionPopup',
}

export enum RedemptionPopupFields {
  Header = 'header',
  Message = 'message',
  ButtonLabel = 'buttonLabel',
}

export enum VideoDataFields {
  Override = 'overrideEnabled',
  Type = 'type',
  Embed = 'embed',
  Vidyard = 'vidyard',
}

export enum VideoDataEmbedFields {
  VideoUrl = 'videoUrl',
}

export enum VideoDataVidyardFields {
  ImageUrl = 'imageUrl',
  VideoUrl = 'videoUrl',
}

const rUrlProtocol = /^((https?|ftp):)?\/\//i;

export const MESSAGE_HEADER_LIMIT = 255;

export const messageOverrideSchema = boolean().default(true);
export const messageHeaderSchema = string()
  .label('Header')
  .max(MESSAGE_HEADER_LIMIT)
  .trim()
  .nullable()
  .default(null)
  .when(MessageDataFields.Message, (messageValue: string | null, schema: StringSchema<string | null>) =>
    messageValue ? schema.min(3).required() : schema,
  );
export const messageTextSchema = string()
  .label('Body Text')
  .trim()
  .nullable()
  .default(null)
  .when(MessageDataFields.Header, (headerValue: string | null, schema: StringSchema<string | null>) =>
    headerValue
      ? schema
          .min(10)
          .when(['$bodyCharsLimit'], (bodyCharsLimit: number, limitSchema: StringSchema<string | null>) =>
            bodyCharsLimit ? limitSchema.max(bodyCharsLimit).required() : limitSchema,
          )
          .required()
      : schema,
  );

export const messageDataSchema = object().shape(
  {
    [MessageDataFields.Header]: messageHeaderSchema,
    [MessageDataFields.Message]: messageTextSchema,
    [MessageDataFields.Override]: messageOverrideSchema,
  },
  [[MessageDataFields.Header, MessageDataFields.Message]],
);

export const afterClaimActionSchema = string()
  .oneOf(Object.values(RedemptionAfterClaimAction))
  .default(RedemptionAfterClaimAction.NoCta)
  .required();
export const afterClaimRedirectUrl = string()
  .label('Landing Page')
  .nullable()
  .default(null)
  .trim()
  .max(255, 'Link must not exceed 255 characters')
  .matches(rUrlProtocol, {
    message: 'Protocol http:// or https:// is missing in the link',
    excludeEmptyString: true,
  })
  .url('Link should contain a valid url')
  .when(RedemptionDataFields.AfterClaimAction, (value: RedemptionAfterClaimAction, schema: AnySchema) =>
    value === RedemptionAfterClaimAction.Redirect ? schema.required() : schema,
  );
export const redemptionPopupEnabledSchema = boolean().default(false);
export const redemptionPopupHeaderSchema = string()
  .label('Popup Header')
  .min(1)
  .max(50)
  .nullable()
  .default('')
  .required();
export const redemptionPopupMessageSchema = string()
  .label('Popup Message')
  .min(1)
  .max(300)
  .nullable()
  .default('')
  .required();
export const redemptionPopupButtonSchema = string()
  .label('Popup Button label')
  .min(1)
  .max(20)
  .nullable()
  .default('')
  .required();
export const redemptionPopupSchema = object()
  .shape({
    [RedemptionPopupFields.Header]: redemptionPopupHeaderSchema,
    [RedemptionPopupFields.Message]: redemptionPopupMessageSchema,
    [RedemptionPopupFields.ButtonLabel]: redemptionPopupButtonSchema,
  })
  .nullable()
  .default(null);
export const redemptionDataSchema = object().shape({
  [RedemptionDataFields.AfterClaimAction]: afterClaimActionSchema,
  [RedemptionDataFields.AfterClaimRedirectUrl]: afterClaimRedirectUrl,
  [RedemptionDataFields.RedemptionPopupEnabled]: redemptionPopupEnabledSchema,
  [RedemptionDataFields.RedemptionPopup]: redemptionPopupSchema,
});

export const videoOverrideSchema = boolean().default(true);
export const videoTypeSchema = string()
  .nullable()
  .default(null)
  .oneOf([...Object.values(MessageVideoType), null]);
export const videoUrlSchema = string()
  .label('Video Url')
  .nullable()
  .default(null)
  .trim()
  .max(255, 'Link must not exceed 255 characters')
  .url('Link should contain a valid url')
  .required();
export const videoEmbedSchema = object()
  .shape({
    [VideoDataEmbedFields.VideoUrl]: videoUrlSchema,
  })
  .nullable()
  .default(null);
export const videoVidyardImageUrlSchema = string()
  .nullable()
  .default(null)
  .trim()
  .max(255, 'Link must not exceed 255 characters')
  .matches(rUrlProtocol, {
    message: 'Protocol http:// or https:// is missing in the link',
    excludeEmptyString: true,
  })
  .url('Link should contain a valid url');
export const videoVidyardVideoUrlSchema = string()
  .nullable()
  .default(null)
  .trim()
  .max(255, 'Link must not exceed 255 characters')
  .matches(rUrlProtocol, {
    message: 'Protocol http:// or https:// is missing in the link',
    excludeEmptyString: true,
  })
  .url('Link should contain a valid url');
export const videoVidyardSchema = object()
  .shape({
    [VideoDataVidyardFields.ImageUrl]: videoVidyardImageUrlSchema,
    [VideoDataVidyardFields.VideoUrl]: videoVidyardVideoUrlSchema,
  })
  .nullable()
  .default(null)
  .when(VideoDataFields.Type, (type: MessageVideoType, schema: AnySchema) =>
    type === MessageVideoType.Vidyard ? schema.required('Vidyard is required') : schema,
  );
export const videoDataSchema = object().shape({
  [VideoDataFields.Override]: videoOverrideSchema,
  [VideoDataFields.Type]: videoTypeSchema,
  [VideoDataFields.Embed]: videoEmbedSchema,
  [VideoDataFields.Vidyard]: videoVidyardSchema,
});

export const messagingFormSchema = object().shape({
  [MessagingStepFields.MessageData]: messageDataSchema,
  [MessagingStepFields.RedemptionData]: redemptionDataSchema,
  [MessagingStepFields.VideoData]: videoDataSchema,
});

export const messagingFormResolver = yupResolver(messagingFormSchema);
export const messagingFormDefaultValues = messagingFormSchema.getDefault() as TProspectingMessaging;
