import { TProgressStep, TeamSidebarStep } from '../store/teams/teamOperation/teamOperation.types';

export const STEPS: Array<TProgressStep> = [
  { step: TeamSidebarStep.TeamInfo, label: 'Name', position: 0 },
  { step: TeamSidebarStep.TeamBudget, label: 'Budget', position: 1 },
];

export const MAX_BUDGET: number = 99999999.99;

/**
 * Used to set selection range for auto focusing text
 */
export const [BUDGET_SELECT_MIN_RANGE, BUDGET_SELECT_MAX_RANGE] = [1, 14];
