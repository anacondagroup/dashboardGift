import { UseFormResetField } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { clone } from 'ramda';
import { useSelector } from 'react-redux';

import { giftingFormDefaultValues } from '../../../../../../store/prospectingCampaign/steps/gifting/gifting.schemas';
import { useGiftingFormPersistValue } from '../../../../../../hooks/useGiftingFormPersistValue';
import { getGiftingDataAsFormValues } from '../../../../../../store/prospectingCampaign/steps/gifting/gifting.selectors';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export type TUseGiftingMarketplacePersistValue = {
  save: (arg0: TProspectingGiftingForm[GiftingStepFields.MarketplaceData]) => void;
  reset: () => void;
};
export const useGiftingMarketplacePersist = ({
  resetField,
}: {
  resetField: UseFormResetField<TProspectingGiftingForm>;
}): TUseGiftingMarketplacePersistValue => {
  const giftingData = useSelector(getGiftingDataAsFormValues);
  const [persistedValue, setPersistValue] = useGiftingFormPersistValue();
  const defaultValue =
    giftingData?.[GiftingStepFields.MarketplaceData] ||
    persistedValue?.[GiftingStepFields.MarketplaceData] ||
    giftingFormDefaultValues[GiftingStepFields.MarketplaceData];

  const isAlreadySaved = !!giftingData;

  const save = useCallback(
    (marketplaceData: TProspectingGiftingForm[GiftingStepFields.MarketplaceData]) => {
      if (!isAlreadySaved) {
        setPersistValue(oldValue => ({ ...oldValue, [GiftingStepFields.MarketplaceData]: marketplaceData }));
      }
    },
    [isAlreadySaved, setPersistValue],
  );

  const reset = useCallback(() => {
    if (defaultValue) {
      const cloned = clone(defaultValue);
      Object.values(MarketplaceDataFields).forEach(fieldName => {
        resetField(GiftingStepFields.MarketplaceData, {
          defaultValue: cloned,
        });
        resetField(`${GiftingStepFields.MarketplaceData}.${fieldName}` as const, {
          defaultValue: cloned[fieldName],
        });
      });
    }
  }, [resetField, defaultValue]);

  return useMemo(
    () => ({
      save,
      reset,
    }),
    [save, reset],
  );
};
