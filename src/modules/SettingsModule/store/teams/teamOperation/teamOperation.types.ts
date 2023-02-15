export enum TeamSidebarStep {
  TeamInfo = 'teamInfo',
  TeamBudget = 'teamBudget',
  TeamSettings = 'TeamSettings',
}

export type TProgressStep = {
  step: TeamSidebarStep;
  label: string;
  position: number;
};
