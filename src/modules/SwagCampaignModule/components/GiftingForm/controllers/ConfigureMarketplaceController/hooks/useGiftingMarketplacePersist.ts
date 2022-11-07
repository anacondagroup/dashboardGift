import { UseFormResetField } from 'react-hook-form';
import { useMemo } from 'react';
import { clone } from 'ramda';
import { useSelector } from 'react-redux';

import { giftingFormDefaultValues } from '../../../../../store/swagCampaign/steps/gifting/gifting.schemas';
import { useGiftingFormPersistValue } from '../../../../../hooks/useGiftingFormPersistValue';
import { getGiftingDataAsFormValues } from '../../../../../store/swagCampaign/steps/gifting/gifting.selectors';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

export type TUseGiftingMarketplacePersistValue = {
  save: (arg0: TSwagCampaignGiftingForm[GiftingStepFields.ExchangeMarketplaceSettings]) => void;
  reset: () => void;
  clean: () => void;
};
export const useGiftingMarketplacePersist = ({
  resetField,
}: {
  resetField: UseFormResetField<TSwagCampaignGiftingForm>;
}): TUseGiftingMarketplacePersistValue => {
  const giftingData = useSelector(getGiftingDataAsFormValues);
  const [persistedValue, setPersistValue] = useGiftingFormPersistValue();
  const defaultValue =
    giftingData?.[GiftingStepFields.ExchangeMarketplaceSettings] ||
    persistedValue?.[GiftingStepFields.ExchangeMarketplaceSettings] ||
    giftingFormDefaultValues[GiftingStepFields.ExchangeMarketplaceSettings];

  const isAlreadySaved = !!giftingData;

  return useMemo(
    () => ({
      save: marketplaceData => {
        if (!isAlreadySaved) {
          setPersistValue(oldValue => ({
            ...oldValue,
            [GiftingStepFields.ExchangeMarketplaceSettings]: marketplaceData,
          }));
        }
      },
      reset: () => {
        Object.values(MarketplaceDataFields).forEach(fieldName => {
          resetField(`${GiftingStepFields.ExchangeMarketplaceSettings}.${fieldName}` as const, {
            defaultValue: clone(defaultValue[fieldName]),
          });
        });
      },
      clean: () => {
        Object.values(MarketplaceDataFields).forEach(fieldName => {
          resetField(`${GiftingStepFields.ExchangeMarketplaceSettings}.${fieldName}` as const, {
            defaultValue: clone(giftingFormDefaultValues[GiftingStepFields.ExchangeMarketplaceSettings][fieldName]),
          });
        });
        setPersistValue(oldValue => ({
          ...oldValue,
          [GiftingStepFields.ExchangeMarketplaceSettings]:
            giftingFormDefaultValues[GiftingStepFields.ExchangeMarketplaceSettings],
          [GiftingStepFields.DefaultGiftData]: giftingFormDefaultValues[GiftingStepFields.DefaultGiftData],
        }));
      },
    }),
    [defaultValue, setPersistValue, resetField, isAlreadySaved],
  );
};
