import { equals, pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { TStatusState, name } from './status.reducer';

const getStatusState = (state: IRootState): TStatusState => state.prospectingCampaign.ui[name];

export const getIsProspectingIdle = pipe(getStatusState, equals(StateStatus.Idle));
export const getIsProspectingPending = pipe(getStatusState, equals(StateStatus.Pending));
export const getIsProspectingFulfilled = pipe(getStatusState, equals(StateStatus.Fulfilled));
export const getIsProspectingRejected = pipe(getStatusState, equals(StateStatus.Rejected));
