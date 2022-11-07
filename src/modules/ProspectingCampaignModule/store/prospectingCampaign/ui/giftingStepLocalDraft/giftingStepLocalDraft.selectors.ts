import { pipe } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';
import { giftingFormDefaultValues } from '../../steps/gifting/gifting.schemas';
import { TProspectingGiftingForm } from '../../steps/gifting/gifting.types';

const getGiftingStepLocalDraftState = (state: IRootState) => state.prospectingCampaign.ui.giftingStepLocalDraft;

export const makeGetGiftingLocalDraftById = (id: number): ((state: IRootState) => TProspectingGiftingForm | null) =>
  pipe(getGiftingStepLocalDraftState, state => (state[id] ? { ...giftingFormDefaultValues, ...state[id] } : null));
