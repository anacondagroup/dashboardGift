import { UseFormResetField } from 'react-hook-form';
import { useMemo } from 'react';
import { clone } from 'ramda';
import { useSelector } from 'react-redux';

import { giftingFormDefaultValues } from '../../../../../store/swagCampaign/steps/gifting/gifting.schemas';
import { useGiftingFormPersistValue } from '../../../../../hooks/useGiftingFormPersistValue';
import { getGiftingDataAsFormValues } from '../../../../../store/swagCampaign/steps/gifting/gifting.selectors';
import {
  GiftingStepFields,
  CustomMarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

export type TUseGiftingMarketplacePersistValue = {
  save: (arg0: TSwagCampaignGiftingForm[GiftingStepFields.CustomMarketPlaceData]) => void;
  reset: () => void;
  clean: () => void;
};
export const useGiftingCustomMarketplacePersist = ({
  resetField,
}: {
  resetField: UseFormResetField<TSwagCampaignGiftingForm>;
}): TUseGiftingMarketplacePersistValue => {
  const giftingData = useSelector(getGiftingDataAsFormValues);
  const [persistedValue, setPersistValue] = useGiftingFormPersistValue();
  const defaultValue =
    giftingData?.[GiftingStepFields.CustomMarketPlaceData] ||
    persistedValue?.[GiftingStepFields.CustomMarketPlaceData] ||
    giftingFormDefaultValues[GiftingStepFields.CustomMarketPlaceData];

  const isAlreadySaved = !!giftingData;

  return useMemo(
    () => ({
      save: customMarketplaceData => {
        if (!isAlreadySaved) {
          setPersistValue(oldValue => ({
            ...oldValue,
            [GiftingStepFields.CustomMarketPlaceData]: customMarketplaceData,
          }));
        }
      },
      reset: () => {
        Object.values(CustomMarketplaceDataFields).forEach(fieldName => {
          resetField(`${GiftingStepFields.CustomMarketPlaceData}.${fieldName}` as const, {
            defaultValue: clone(defaultValue[fieldName]),
          });
        });
      },
      clean: () => {
        Object.values(CustomMarketplaceDataFields).forEach(fieldName => {
          resetField(`${GiftingStepFields.CustomMarketPlaceData}.${fieldName}` as const, {
            defaultValue: clone(giftingFormDefaultValues[GiftingStepFields.CustomMarketPlaceData][fieldName]),
          });
        });
        setPersistValue(oldValue => ({
          ...oldValue,
          [GiftingStepFields.CustomMarketPlaceData]: giftingFormDefaultValues[GiftingStepFields.CustomMarketPlaceData],
        }));
      },
    }),
    [defaultValue, setPersistValue, resetField, isAlreadySaved],
  );
};
