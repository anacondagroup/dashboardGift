import React, { memo, useMemo } from 'react';
import { AlyceTheme } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { CommonData, CountriesPicker } from '@alycecom/modules';
import { EntityId } from '@alycecom/utils';

import { ProductFilter } from '../../../../store/products/products.types';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  popper: {
    width: 400,
    minWidth: 400,
  },
  countryValueLabel: {
    color: palette.text.primary,
  },
}));

export interface ICountriesProps {
  value: EntityId[];
  onChange: (value: EntityId[], name: ProductFilter) => void;
  options: EntityId[];
}

const Countries = ({ value, onChange, options }: ICountriesProps) => {
  const classes = useStyles();

  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(options as number[]), [options]),
  );
  const selectedCountries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(value as number[]), [value]),
  );

  return (
    <CountriesPicker<true>
      label="Countries"
      isLabelExternal
      searchLabel="Search country"
      name={ProductFilter.CountryIds}
      value={selectedCountries}
      onChange={selected => {
        onChange(
          selected.map(({ id }) => id),
          ProductFilter.CountryIds,
        );
      }}
      options={countries}
      multiple
      classes={{
        popper: classes.popper,
        valueLabel: classes.countryValueLabel,
      }}
      buttonIconProps={{ fontSize: 0.8 }}
      listboxProps={{ maxVisibleRows: 4 }}
    />
  );
};

export default memo(Countries);
