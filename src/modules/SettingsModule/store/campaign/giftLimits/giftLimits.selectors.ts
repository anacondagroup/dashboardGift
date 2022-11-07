import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const getGiftLimitsState = (state: IRootState) => state.settings.campaign.giftLimits;

export const getGiftLimits = pipe(getGiftLimitsState, state => state.giftLimits);
export const getIsLoading = pipe(getGiftLimitsState, state => state.isLoading);
export const getSelectedUsers = pipe(getGiftLimitsState, state => state.selectedUsers);
