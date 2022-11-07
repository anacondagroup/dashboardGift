import React, { memo, ReactElement, useCallback } from 'react';
import { EntityId } from '@alycecom/utils';
import { CountriesPicker, TCountry } from '@alycecom/modules';
import { makeStyles } from '@mui/styles';

import { ProductFilter } from '../../store/products/products.types';
import { useGetCountriesOptions } from '../../hooks/useGetCountriesOptions';

const useStyles = makeStyles(() => ({
  popper: {
    width: 320,
    minWidth: 320,
  },
}));

export interface IMarketplaceCountriesFilterProps {
  onChange: (countryIds: EntityId[]) => void;
  disabled?: boolean;
}

const MarketplaceCountriesFilter = ({ onChange, disabled = false }: IMarketplaceCountriesFilterProps): ReactElement => {
  const classes = useStyles();
  const { items, selected } = useGetCountriesOptions();

  const handleChangeCountries = useCallback(
    (selectedValues: TCountry[]) => {
      onChange(selectedValues.map(item => item.id));
    },
    [onChange],
  );

  return (
    <CountriesPicker<true>
      label="Countries"
      name={ProductFilter.CountryIds}
      value={selected}
      onChange={handleChangeCountries}
      options={items}
      disabled={disabled}
      selectAllEnabled
      classes={{
        popper: classes.popper,
      }}
      multiple
    />
  );
};

export default memo(MarketplaceCountriesFilter);
