import { pipe, equals } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { TStatusState } from './status.reducer';

const getStatusState = (state: IRootState): TStatusState => state.activate.ui.status;

export const getIsActivateIdle = pipe(getStatusState, equals(StateStatus.Idle));
export const getIsActivatePending = pipe(getStatusState, equals(StateStatus.Pending));
export const getIsActivateFulfilled = pipe(getStatusState, equals(StateStatus.Fulfilled));
