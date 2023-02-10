export interface ICampaign {
  name: string;
}

export interface IGift {
  id: number;
}

export interface IGiftParams {
  sortDirection: string;
  search: string;
  campaignId?: number;
  teamId?: number;
  memberId?: number;
  sort: string;
  page: string;
  dateRangeTo: string;
  dateRangeFrom: string;
  giftIds: number[];
}
