export enum TeamSidebarStep {
  TeamInfo = 'teamInfo',
  TeamBudget = 'teamBudget',
}

export type TProgressStep = {
  step: TeamSidebarStep;
  label: string;
  position: number;
};
