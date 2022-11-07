import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';

import { makeGetGiftingLocalDraftById } from '../store/prospectingCampaign/ui/giftingStepLocalDraft/giftingStepLocalDraft.selectors';
import { giftingFormDefaultValues } from '../store/prospectingCampaign/steps/gifting/gifting.schemas';
import { saveGiftingDraftDataById } from '../store/prospectingCampaign/ui/giftingStepLocalDraft/giftingStepLocalDraft.actions';
import { TProspectingGiftingForm } from '../store/prospectingCampaign/steps/gifting/gifting.types';

import { useProspecting } from './useProspecting';

export type TPersistValueOrCallback =
  | TProspectingGiftingForm
  | ((oldValue: TProspectingGiftingForm) => TProspectingGiftingForm);
export type TUseGiftingFormPersistValue = [TProspectingGiftingForm | null, (arg0: TPersistValueOrCallback) => void];

export const useGiftingFormPersistValue = (): TUseGiftingFormPersistValue => {
  const dispatch = useDispatch();
  const { campaignId, isBuilder } = useProspecting();

  const persistValue = useSelector(
    useMemo(() => (campaignId && isBuilder ? makeGetGiftingLocalDraftById(campaignId) : () => null), [
      campaignId,
      isBuilder,
    ]),
  );

  const setPersistValue = useCallback(
    (valueOrCallback: TPersistValueOrCallback) => {
      if (!campaignId || !isBuilder) {
        return;
      }
      const value =
        typeof valueOrCallback === 'function'
          ? valueOrCallback(persistValue || giftingFormDefaultValues)
          : valueOrCallback;

      dispatch(
        saveGiftingDraftDataById({
          ...value,
          id: campaignId,
        }),
      );
    },
    [dispatch, persistValue, campaignId, isBuilder],
  );

  return useMemo(() => [persistValue, setPersistValue], [persistValue, setPersistValue]);
};
