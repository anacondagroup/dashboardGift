import { GiftingInsights } from './reporting.constants';

export interface IListResponse {
  data: {
    reports: {
      [key: string]: IReportInfo;
    };
  };
}

export interface IReportResponse {
  reports: {
    [key: string]: IReportInfo;
  };
}

export interface ICreateResponse {
  data: IReportInfo;
}

export interface IReportInfo {
  id: number;
  name: string;
  sendDay: string;
  timespan: string;
  sendTime: string;
  timezone: string;
  orgId: number;
  schedule: string;
  teamId: string;
}

export interface IReportCounts {
  [GiftingInsights.performanceSummary]: number;
  [GiftingInsights.teamUsage]: number;
  [GiftingInsights.giftingTrends]: number;
}

export interface ICreateReportRequest {
  email: string;
  orgId: number;
  teamId: number[];
  schedule: string;
  sendDay: string | number;
  sendTime: string;
  timespan: string;
  name: string;
  timezone: string;
  id?: number;
}

export interface IDownloadReportRequest {
  orgId: number;
  teamId: number[];
  startDate: string | undefined;
  endDate: string | undefined;
  name: string;
  runOnce: boolean;
}
