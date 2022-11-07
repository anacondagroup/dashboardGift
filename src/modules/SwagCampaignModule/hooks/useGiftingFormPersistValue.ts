import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';

import { makeGetGiftingLocalDraftById } from '../store/swagCampaign/ui/giftingStepLocalDraft/giftingStepLocalDraft.selectors';
import { giftingFormDefaultValues } from '../store/swagCampaign/steps/gifting/gifting.schemas';
import { saveGiftingDraftDataById } from '../store/swagCampaign/ui/giftingStepLocalDraft/giftingStepLocalDraft.actions';
import { TSwagCampaignGiftingForm } from '../store/swagCampaign/steps/gifting/gifting.types';

import { useSwag } from './useSwag';

export type TPersistValueOrCallback =
  | TSwagCampaignGiftingForm
  | ((oldValue: TSwagCampaignGiftingForm) => TSwagCampaignGiftingForm);
export type TUseGiftingFormPersistValue = [TSwagCampaignGiftingForm | null, (arg0: TPersistValueOrCallback) => void];

export const useGiftingFormPersistValue = (): TUseGiftingFormPersistValue => {
  const dispatch = useDispatch();
  const { campaignId, isBuilder } = useSwag();

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
