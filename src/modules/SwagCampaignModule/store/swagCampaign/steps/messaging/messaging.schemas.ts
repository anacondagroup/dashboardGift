import { object, string, StringSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TSwagMessaging } from '../../swagCampaign.types';

export enum MessagingStepFields {
  MessageData = 'messageData',
}

export enum MessageDataFields {
  Override = 'overrideEnabled',
  Header = 'pageHeader',
  Message = 'pageBody',
}

export const messageHeaderSchema = string()
  .label('Header')
  .max(255)
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
  },
  [[MessageDataFields.Header, MessageDataFields.Message]],
);

export const messagingFormSchema = object().shape({
  [MessagingStepFields.MessageData]: messageDataSchema,
});

export const messagingFormResolver = yupResolver(messagingFormSchema);
export const messagingFormDefaultValues = messagingFormSchema.getDefault() as TSwagMessaging;
