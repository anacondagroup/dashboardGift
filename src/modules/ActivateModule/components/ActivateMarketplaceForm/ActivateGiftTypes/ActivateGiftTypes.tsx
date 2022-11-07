import React, { useMemo, useCallback, memo } from 'react';
import { EntityId } from '@alycecom/utils';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { UseFormTrigger, UseFormSetValue } from 'react-hook-form';

import { GiftTypes, IGiftType } from '../../../store/entities/giftTypes/giftTypes.types';
import CheckboxWithContent from '../../../../../components/Shared/Checkboxes/CheckboxWithContent';
import {
  getGiftTypeIdsUnavailableForCountries,
  getGiftTypes,
  getGiftTypesIdsRestrictedByTeam,
  getIsGiftTypesLoading,
} from '../../../store/entities/giftTypes/giftTypes.selectors';
import { IMarketplaceFormValues, MarketplaceFormFields } from '../../../store/steps/gift/gift.schemas';
import { getIsGiftBudgetBlocked } from '../../../store/entities/giftTypes/giftTypes.helpers';

import RestrictedGiftType from './RestrictedGiftType';
import GiftTypeCountries from './GiftTypeCountries';

export interface IActivateGiftTypesProps {
  value: EntityId[];
  onChange: (values: EntityId[]) => void;
  trigger: UseFormTrigger<IMarketplaceFormValues>;
  setValue: UseFormSetValue<IMarketplaceFormValues>;
}

const ActivateGiftTypes = ({ value = [], setValue, trigger, onChange }: IActivateGiftTypesProps): JSX.Element => {
  const items = useSelector(getGiftTypes);
  const isLoading = useSelector(getIsGiftTypesLoading);

  const restrictedByTeamGiftTypeIds = useSelector(getGiftTypesIdsRestrictedByTeam);
  const unavailableGiftTypeIds = useSelector(getGiftTypeIdsUnavailableForCountries);

  const giftTypes = useMemo(
    () => items.filter(item => ![GiftTypes.donation, GiftTypes.giftCard].includes(item.id as GiftTypes)),
    [items],
  );

  const isGiftTypeChecked = useCallback(
    (giftType: IGiftType) =>
      !value.includes(giftType.id) &&
      !restrictedByTeamGiftTypeIds.includes(giftType.id) &&
      !unavailableGiftTypeIds.includes(giftType.id),
    [value, restrictedByTeamGiftTypeIds, unavailableGiftTypeIds],
  );

  const isGiftTypeAvailable = useCallback((giftType: IGiftType) => !unavailableGiftTypeIds.includes(giftType.id), [
    unavailableGiftTypeIds,
  ]);

  const handleOnChange = useCallback(
    giftTypeId => {
      const restrictedGiftTypeIds = value.includes(giftTypeId)
        ? value.filter(id => id !== giftTypeId)
        : [...value, giftTypeId];
      onChange(restrictedGiftTypeIds);
      const isGiftBudgetBlocked = getIsGiftBudgetBlocked(
        restrictedGiftTypeIds,
        restrictedByTeamGiftTypeIds,
        unavailableGiftTypeIds,
      );
      if (isGiftBudgetBlocked) {
        setValue(MarketplaceFormFields.MinBudgetPrice, null, { shouldDirty: false });
        setValue(MarketplaceFormFields.MaxBudgetPrice, null, { shouldDirty: false });
      }
      trigger(MarketplaceFormFields.MinBudgetPrice);
      trigger(MarketplaceFormFields.MaxBudgetPrice);
    },
    [onChange, value, trigger, setValue, restrictedByTeamGiftTypeIds, unavailableGiftTypeIds],
  );

  return (
    <Box>
      {giftTypes.map(giftType => (
        <Box mb={2} key={giftType.id}>
          {giftType.isTeamRestricted ? (
            <RestrictedGiftType title={giftType.name} description={giftType.description} />
          ) : (
            <Box display="flex" justifyContent="space-between">
              <Box width="75%">
                <CheckboxWithContent
                  value={giftType.id}
                  title={giftType.name}
                  description={giftType.description}
                  isLoading={isLoading}
                  onChange={handleOnChange}
                  checked={isGiftTypeChecked(giftType)}
                  disabled={!isGiftTypeAvailable(giftType)}
                  disabledTooltip="The gift type is not available for your selected countries yet. Check back soon."
                  data-testid={`ActivateCreation.GiftTypes.Checkbox-${giftType.id}`}
                />
              </Box>
              {isGiftTypeAvailable(giftType) && <GiftTypeCountries giftType={giftType} />}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default memo(ActivateGiftTypes);
