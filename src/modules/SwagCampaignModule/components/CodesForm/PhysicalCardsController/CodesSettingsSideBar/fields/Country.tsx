import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Control, useController } from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import { CommonData, CountriesPicker, TCountry } from '@alycecom/modules';

import { getDetailsData } from '../../../../../store/swagCampaign/steps/details/details.selectors';
import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  DeliveryAddressDataFields,
  DeliveryAddressLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface ICountryProps {
  control: Control<TPhysicalCardsFormValues>;
  handleChangeCountry: (countryId: number) => void;
}

const Country = ({ control, handleChangeCountry }: ICountryProps): JSX.Element => {
  const name = `${CodesSettingsDataFields.DeliveryAddress}.${DeliveryAddressDataFields.CountryId}` as const;

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const countries = useSelector(CommonData.selectors.getNonInternationalCountries);
  const campaignCountry = useSelector(getDetailsData);
  const selectedCountry = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountryById(value || campaignCountry), [value, campaignCountry]),
  );

  const handleChangeSelectedCountry = useCallback(
    (country: TCountry | null) => {
      if (country) {
        handleChangeCountry(country.id);
        onChange(country.id);
      }
    },
    [onChange, handleChangeCountry],
  );

  return (
    <>
      <CountriesPicker<false>
        label={DeliveryAddressLabels.Country}
        name={DeliveryAddressDataFields.CountryId}
        value={selectedCountry}
        onChange={handleChangeSelectedCountry}
        options={countries}
        multiple={false}
        isLabelExternal
        data-testid="SwagBuilder.CodesStep.PhysicalCodes.Country"
      />
      {!!error?.message && <FormHelperText>{error?.message}</FormHelperText>}
    </>
  );
};

export default Country;
