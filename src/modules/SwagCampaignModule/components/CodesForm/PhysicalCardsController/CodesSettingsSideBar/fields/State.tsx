import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Control, useController } from 'react-hook-form';
import { FormHelperText, MenuItem } from '@mui/material';
import { CommonData } from '@alycecom/modules';
import { SelectFilter } from '@alycecom/ui';

import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  DeliveryAddressDataFields,
  DeliveryAddressLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IStateProps {
  control: Control<TPhysicalCardsFormValues>;
  countryId: number;
}

const State = ({ control, countryId }: IStateProps): JSX.Element => {
  const governments = useSelector(CommonData.selectors.getGovernments);
  const name = `${CodesSettingsDataFields.DeliveryAddress}.${DeliveryAddressDataFields.State}` as const;

  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  useEffect(() => {
    if (countryId && value) {
      const isNotSameCountry = !governments[countryId]?.some(option => value === option.name);
      if (isNotSameCountry) {
        onChange('');
      }
    }
  }, [countryId, value, governments, onChange]);

  return (
    <>
      <SelectFilter
        label={DeliveryAddressLabels.State}
        name={name}
        value={value}
        fullWidth
        required
        onFilterChange={v => onChange(v[name] || '')}
        selectProps={{
          onBlur,
        }}
        error={!!error?.message}
        data-testid="SwagBuilder.CodesStep.PhysicalCodes.State"
      >
        {governments[countryId].map(item => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </SelectFilter>
      {!!error?.message && <FormHelperText error>{error?.message}</FormHelperText>}
    </>
  );
};

export default State;
