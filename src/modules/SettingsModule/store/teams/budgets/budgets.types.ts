export interface ITeamMembers {
  userId: number;
  budget: number;
}

export enum RefreshPeriod {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  NoReset = 'no reset',
}

export enum NotifyTeamAdminType {
  EveryUsed = 'every_used',
  OnceUsed = 'once_used',
  OnceRemaining = 'once_remaining',
}

export enum NotifySenderType {
  EveryUsed = 'every_used',
  OnceUsed = 'once_used',
  OnceRemaining = 'once_remaining',
}

export enum PauseGiftingOn {
  Claimed = 'claimed',
  Sent = 'sent',
}

export interface IBudget {
  amount: number;
  teamId: number;
  teamMembers: Array<ITeamMembers>;
  period: RefreshPeriod;
  rollover: boolean;
  notifyTeamAdminType: NotifyTeamAdminType | null;
  notifySenderType: NotifySenderType | null;
  notifySenderAtPercent: number | null;
  notifyTeamAdminAtPercent: number | null;
  pauseGiftingOn: PauseGiftingOn;
}
