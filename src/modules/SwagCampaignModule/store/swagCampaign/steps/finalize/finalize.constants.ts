import { RecipientActionsFields } from '../gifting/gifting.types';

export const RECIPIENT_ACTION_LABELS = {
  [RecipientActionsFields.CaptureDate]: 'accept a calendar invite',
  [RecipientActionsFields.CapturePhone]: 'provide phone number',
  [RecipientActionsFields.CaptureEmail]: 'provide email address',
  [RecipientActionsFields.CaptureQuestion]: 'answer custom questions',
  [RecipientActionsFields.CaptureAffidavit]: 'accept custom terms & conditions',
} as Record<string, string>;
