/* eslint-disable camelcase */
import { applySpec, pathOr, prop, path, pipe, unless, isNil, converge, or } from 'ramda';

export type TContactResearchInfo = {
  image: string;
  company: string;
  position: string;
  education: string;
  location: string;
  discoveryNotes: string;
  researchTags: { title: string; url: string; tags: string[] }[];
};

export type TContactInfo = {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  countryId: number;
  isUnsubscribe: boolean;
  company: string;
  research: TContactResearchInfo | null;
};

export type TContactStatistic = {
  created: number;
  sent: number;
  accepted: number;
  meetings: number;
};

export type TContactLatestGift = {
  id: number;
  status_id: number;
  history: { label: string; status_string: string; action_date: string }[];
  shipping_info: {
    tracking_carrier: string;
    tracking_number: string;
    tracking_state: string;
    tracking_link: string;
  };
  need_more_info_message: string;
  prospect_meeting_notes: string;
  free_meetings: { start: string; end: string; timezone: string }[];
  sent_by: {
    id: number;
    full_name: string;
    avatar: string;
    email: string;
    has_integration: boolean;
  };
  sent_as: {
    id: number;
    full_name: string;
    avatar: string;
    email: string;
    has_integration: boolean;
  };
  campaign: {
    id: number;
    name: string;
    team_id: number;
  };
  product: {
    name: string;
    image: string;
  };
  meeting: {
    id: number;
    start: string;
    end: string;
    title: string;
    meeting_type: string;
    additional_info: string;
    outcome: string;
    status: string;
  };
};

export type TContact = {
  contact: TContactInfo;
  statistic: TContactStatistic;
  latestGift: TContactLatestGift | null;
};

const transformContactGift = unless(
  isNil,
  applySpec<TContactLatestGift>({
    sentAs: prop('sent_as'),
    sentBy: prop('sent_by'),
    shippingInfo: prop('shipping_info'),
    statusId: prop('status_id'),
    adminNote: prop('admin_note'),
    id: prop('id'),
    history: prop('history'),
    need_more_info_message: prop('need_more_info_message'),
    prospect_meeting_notes: prop('prospect_meeting_notes'),
    free_meetings: prop('free_meetings'),
    campaign: prop('campaign'),
    product: prop('product'),
    meeting: prop('meeting'),
  }),
);

// TODO: Migrate profile store to TS
export const transformContactInfo = applySpec({
  id: path(['contact', 'id']),
  email: path(['contact', 'email']),
  avatar: pathOr('', ['contact', 'research', 'image']),
  company: converge(or, [path(['contact', 'research', 'company']), path(['contact', 'company'])]),
  employment: converge(or, [path(['contact', 'position']), path(['contact', 'research', 'employment'])]),
  firstName: path(['contact', 'firstName']),
  lastName: path(['contact', 'lastName']),
  fullName: path(['contact', 'fullName']),
  education: pathOr('', ['contact', 'research', 'education']),
  location: pathOr('', ['contact', 'research', 'location']),
  phoneNumber: path(['contact', 'phone']),
  discoveryNotes: pathOr('', ['contact', 'research', 'discoveryNotes']),
  researchTags: pathOr([], ['contact', 'research', 'researchTags']),
  countryId: path(['contact', 'countryId']),
  statistic: prop('statistic'),
  latestGift: pipe(prop('latestGift'), transformContactGift),
  currentGift: pipe(prop('currentGift'), transformContactGift),
});
