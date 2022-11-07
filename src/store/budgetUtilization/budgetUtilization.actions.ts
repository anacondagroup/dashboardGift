import { createAsyncAction } from '@alycecom/utils';

import { IBudgetUtilizationByTeam } from './budgetUtilization.types';

const PREFIX = 'BUDGET_UTILIZATION';

export const loadTeamBudgetUtilization = createAsyncAction<{ teamId: number }, IBudgetUtilizationByTeam[], void>(
  `${PREFIX}/LOAD_TEAM_BUDGET_UTILIZATION`,
);
