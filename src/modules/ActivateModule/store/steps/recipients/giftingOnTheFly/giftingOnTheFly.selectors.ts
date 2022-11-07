import { StateStatus } from '@alycecom/utils';
import { pipe } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

const getGiftingOnTheFlyState = (state: IRootState) => state.activate.steps.recipients.giftingOnTheFly;

export const getGiftingOnTheFlyStatus = pipe(getGiftingOnTheFlyState, state => state.status);
export const getIsGiftingOnTheFlyLoading = pipe(getGiftingOnTheFlyState, state => state.status === StateStatus.Pending);

export const getIsGiftingOnTheFlyEnabled = pipe(getGiftingOnTheFlyState, state => state.data.isEnabled);
