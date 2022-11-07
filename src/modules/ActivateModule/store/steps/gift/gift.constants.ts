import { RecipientActions } from '../../activate.types';

export const RECIPIENT_ACTION_LABELS: Record<RecipientActions, string> = {
  [RecipientActions.capturePhone]: 'provide phone number',
  [RecipientActions.captureEmail]: 'provide email address',
  [RecipientActions.captureDate]: 'accept a calendar invite',
  [RecipientActions.captureQuestion]: 'answer custom questions',
  [RecipientActions.captureAffidavit]: 'accept custom terms & conditions',
  [RecipientActions.question]: '',
  [RecipientActions.affidavit]: '',
};
