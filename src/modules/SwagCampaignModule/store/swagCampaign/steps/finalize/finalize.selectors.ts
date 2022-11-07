import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

const getFinalizeState = (state: IRootState) => state.swagCampaign.steps.finalize;

export const getFinalizeStatus = pipe(getFinalizeState, prop('status'));
export const getIsFinalizeIdle = pipe(getFinalizeStatus, equals(StateStatus.Idle));
export const getIsFinalizePending = pipe(getFinalizeStatus, equals(StateStatus.Pending));
export const getIsFinalizeFulfilled = pipe(getFinalizeStatus, equals(StateStatus.Fulfilled));
export const getIsFinalizeRejected = pipe(getFinalizeStatus, equals(StateStatus.Rejected));
