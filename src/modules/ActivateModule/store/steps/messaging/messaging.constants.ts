import { PlaceholderName, placeholdersConstants } from '../../../constants/placeholders.constants';

export const defaultHeader = 'Your gift link is not available anymore';
export const defaultMessage = `Sorry, this gift link is not available anymore. Please contact gift sender ${
  placeholdersConstants[PlaceholderName.SenderEmail].value
} for more information`;

export const defaultMetaHeader = 'A gift you’re sure to love';
export const defaultMetaDescription = `See what ${
  placeholdersConstants[PlaceholderName.SenderFullName].value
} gifted you`;
