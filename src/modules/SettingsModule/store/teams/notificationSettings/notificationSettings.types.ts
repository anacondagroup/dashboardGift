export interface INotificationSettingsTypes {
  isAdminNotify: boolean;
  isSenderNotify: boolean;
  adminNotifyOption: string | undefined;
  senderNotifyOption: string | undefined;
  isLoading: boolean;
}

export interface TeamBudgetUtilizationThresholdRequest {
  admin: BudgetUtilizationThresholdRequest;
  member: BudgetUtilizationThresholdRequest;
}

export interface BudgetUtilizationThresholdRequest {
  notifyEnabled: boolean;
  notifyAtPercent: number;
  notifyType: NotifyEnum;
}

export interface TeamBudgetUtilizationThresholdDataResponse {
  data: TeamBudgetUtilizationThresholdResponse;
}

export interface TeamBudgetUtilizationThresholdResponse {
  admin: BudgetUtilizationThresholdResponse;
  member: BudgetUtilizationThresholdResponse;
}

export interface BudgetUtilizationThresholdResponse {
  notifyEnabled: boolean;
  notifyAtPercent: number;
  notifyType: NotifyEnum;
}

export enum NotifyEnum {
  ONCE = 'once_used',
  EVERY = 'every_used',
}

export interface INotifyOption {
  title: string;
  type: NotifyEnum;
  percent: number;
}

export const notificationOptions: Record<string, INotifyOption> = {
  every_used_10: {
    title: 'Every 10% used',
    type: NotifyEnum.EVERY,
    percent: 10,
  },
  every_used_20: {
    title: 'Every 20% used',
    type: NotifyEnum.EVERY,
    percent: 20,
  },
  once_used_50: {
    title: 'Once 50% used',
    type: NotifyEnum.ONCE,
    percent: 50,
  },
  once_used_60: {
    title: 'Once 60% used',
    type: NotifyEnum.ONCE,
    percent: 60,
  },
  once_used_70: {
    title: 'Once 70% used',
    type: NotifyEnum.ONCE,
    percent: 70,
  },
  once_used_80: {
    title: 'Once 80% used',
    type: NotifyEnum.ONCE,
    percent: 80,
  },
  once_used_90: {
    title: 'Once 90% used',
    type: NotifyEnum.ONCE,
    percent: 90,
  },
  once_used_100: {
    title: 'Once 100% used',
    type: NotifyEnum.ONCE,
    percent: 100,
  },
};
