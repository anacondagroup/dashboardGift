export enum BudgetCreateField {
  Amount = 'amount',
  Type = 'type',
  RefreshPeriod = 'period',
  RefreshSelected = 'isRefreshSelected',
  BudgetSet = 'isBudgetSet',
  PauseOption = 'pauseGiftingOn',
  TeamMemberBudgets = 'teamMembers',
  Rollover = 'rollover',
  NotifyTeamAdminType = 'notifyTeamAdminType',
  NotifySenderType = 'notifySenderType',
  NotifySenderAtPercent = 'notifySenderAtPercent',
  NotifyTeamAdminAtPercent = 'notifyTeamAdminAtPercent',
}

export enum BudgetType {
  User = 'user',
  Team = 'team',
}

export enum PauseGiftingOnOption {
  Claimed = 'claimed',
  Sent = 'sent',
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

export interface ITeamMemberBudget {
  userId: number;
  budget: number;
}

export interface ITeamMemberBudgets {
  teamMemberBudgets: ITeamMemberBudget[];
}

export type TBudgetCreateParams = {
  [BudgetCreateField.Amount]: number;
  [BudgetCreateField.Type]: BudgetType;
  [BudgetCreateField.RefreshPeriod]: string;
  [BudgetCreateField.PauseOption]: PauseGiftingOnOption;
  [BudgetCreateField.TeamMemberBudgets]: Array<ITeamMemberBudget>;
  [BudgetCreateField.NotifyTeamAdminType]: NotifyTeamAdminType | null;
  [BudgetCreateField.NotifySenderType]: NotifySenderType | null;
  [BudgetCreateField.NotifySenderAtPercent]: number | null;
  [BudgetCreateField.NotifyTeamAdminAtPercent]: number | null;
  [BudgetCreateField.Rollover]: boolean | null;
};

export enum RefreshPeriod {
  Monthly = 'monthly',
  Weekly = 'weekly',
  Quarterly = 'quarterly',
  NoRefresh = 'no refresh',
}
