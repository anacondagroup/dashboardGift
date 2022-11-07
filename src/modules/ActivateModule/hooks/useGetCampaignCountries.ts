import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { CommonData, TCountry } from '@alycecom/modules';

import { getCountryIds } from '../store/steps/details';

const DEFAULT_COUNTRY_IDS = [CommonData.COUNTRIES.US.id];

export const useGetCampaignCountries = (): TCountry[] => {
  const countryIds = useSelector(getCountryIds);

  return useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(countryIds || DEFAULT_COUNTRY_IDS), [countryIds]),
  );
};
