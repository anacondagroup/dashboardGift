export interface IResearchTag {
  title: string;
  url: string;
  tags: string[];
}

export interface IProfile {
  id: number | null;
  avatar: string;
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  employment: string;
  education: string;
  location: string;
  phoneNumber: string;
  discoveryNotes?: string;
  researchTags: IResearchTag[];
  countryId?: number;
  isUnsubscribed: boolean;
}

/* eslint-disable camelcase */
export interface IGiftRecipient {
  id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  employment: string;
  company: string;
  avatar: string;
}
/* eslint-enable camelcase */
