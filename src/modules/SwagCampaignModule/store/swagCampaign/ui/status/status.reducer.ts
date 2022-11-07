import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { fetchSwagById, fetchSwagDraftById, resetSwagCampaign } from '../../swagCampaign.actions';

export type TStatusState = StateStatus;

export const status = createReducer<StateStatus>({}, StateStatus.Idle);

status.on(fetchSwagDraftById.pending, () => StateStatus.Pending);
status.on(fetchSwagDraftById.fulfilled, () => StateStatus.Fulfilled);
status.on(fetchSwagDraftById.rejected, () => StateStatus.Rejected);

status.on(fetchSwagById.pending, () => StateStatus.Pending);
status.on(fetchSwagById.fulfilled, () => StateStatus.Fulfilled);
status.on(fetchSwagById.rejected, () => StateStatus.Rejected);

status.on(resetSwagCampaign, () => StateStatus.Idle);
