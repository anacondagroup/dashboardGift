/* eslint-disable camelcase */

export type THistoryItem = {
  action_date: string;
  label: string;
  status_string: string;
};

export type TMeetingInfo = {
  id: number;
  additional_info: string;
  end: string;
  meeting_type: string;
  outcome: string;
  start: string;
  status: string;
  title: string;
};

export type TSender = {
  id: number;
  email: string;
  full_name: string;
  avatar: string;
};

export type TShippingInfo = {
  tracking_link: string;
  tracking_number: string;
  tracking_state: string;
  tracking_carrier: string;
};

export type TGiftHistoryItem = {
  id: number;
  campaign: {
    id: number;
    name: string;
    team_id: number;
  };
  history: THistoryItem[];
  meeting: TMeetingInfo;
  product: {
    name: string;
    image: string;
  };
  sentAs: TSender;
  sendBy: TSender;
  shippingInfo: TShippingInfo;
  statusId: number;
  createdAt: string;
  meetingNotes: string;
};
/* eslint-enable camelcase */
