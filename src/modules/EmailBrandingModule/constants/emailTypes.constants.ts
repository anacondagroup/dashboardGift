export interface IEmailType {
  id: number;
  label: string;
}

export enum EmailType {
  initialEmailSenderToRecipient = 'initial_email_sender_to_recipient',
  initialEmailByIntegration = 'recipient_initial_email_by_integration',
}
