import { equals, pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

const pathToBudgetCreateState = (state: IRootState) => state.settings.teams.budgetCreate;

const getStatus = pipe(pathToBudgetCreateState, state => state.status);

export const getErrors = pipe(pathToBudgetCreateState, state => state.errors);

export const getIsBudgetCreateLoading = pipe(getStatus, equals(StateStatus.Pending));
