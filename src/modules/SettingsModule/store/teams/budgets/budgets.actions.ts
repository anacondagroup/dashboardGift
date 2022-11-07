import { createAsyncAction, EntityId } from '@alycecom/utils';

import { IBudget } from './budgets.types';

const PREFIX = 'BUDGETS_SETTINGS';

export const loadBudgets = createAsyncAction<{ teamIds: EntityId[] }, IBudget[], void>(`${PREFIX}/LOAD_BUDGET`);
