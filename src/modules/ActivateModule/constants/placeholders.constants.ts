export enum PlaceholderName {
  SenderFirstName = 'senderFirstName',
  SenderLastName = 'senderLastName',
  SenderFullName = 'senderFullName',
  SenderEmail = 'senderEmail',
}

export const placeholdersConstants = {
  [PlaceholderName.SenderFirstName]: { label: 'Sender first name', value: '[sender-first-name]' },
  [PlaceholderName.SenderLastName]: { label: 'Sender last name', value: '[sender-last-name]' },
  [PlaceholderName.SenderFullName]: { label: 'Sender full name', value: '[sender-full-name]' },
  [PlaceholderName.SenderEmail]: { label: 'Sender email', value: '[sender-email]' },
};

export const giftLinkExpireMessagePlaceholders = [
  placeholdersConstants[PlaceholderName.SenderFirstName],
  placeholdersConstants[PlaceholderName.SenderLastName],
  placeholdersConstants[PlaceholderName.SenderEmail],
];

export const recipientMetaPlaceholders = [
  placeholdersConstants[PlaceholderName.SenderFirstName],
  placeholdersConstants[PlaceholderName.SenderLastName],
  placeholdersConstants[PlaceholderName.SenderFullName],
];
