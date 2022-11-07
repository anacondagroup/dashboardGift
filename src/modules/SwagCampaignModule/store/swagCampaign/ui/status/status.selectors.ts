import { equals, pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { TStatusState } from './status.reducer';

const getStatusState = (state: IRootState): TStatusState => state.swagCampaign.ui.status;

export const getIsSwagIdle = pipe(getStatusState, equals(StateStatus.Idle));
export const getIsSwagPending = pipe(getStatusState, equals(StateStatus.Pending));
