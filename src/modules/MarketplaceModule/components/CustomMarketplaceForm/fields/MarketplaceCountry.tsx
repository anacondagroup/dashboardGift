import React, { useMemo, memo } from 'react';
import { FormControl, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useController } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Features, CountriesPicker } from '@alycecom/modules';
import { AlyceTheme } from '@alycecom/ui';
import { useGetAvailableCountries, TCountry } from '@alycecom/services';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const useStyles = makeStyles<AlyceTheme>(({ palette, zIndex }) => ({
  popper: {
    zIndex: zIndex.modal,
    maxWidth: '100%',
    width: '100%',
  },
  countryValueLabel: {
    color: palette.text.primary,
  },
}));

const MarketplaceCountry = ({ control, disabled }: IFieldProps): JSX.Element => {
  const classes = useStyles();
  const isInternationalEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.INTERNATIONAL), []),
  );
  const { data: countries } = useGetAvailableCountries({ isInternational: isInternationalEnabled });

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: CustomMarketplaceField.CountryIds,
    control,
  });

  const selectedCountries = useMemo(() => countries.filter(({ id }) => value.includes(id as number)), [
    countries,
    value,
  ]);

  return (
    <FormControl error={!!error?.message} fullWidth variant="outlined">
      <CountriesPicker<true, TCountry>
        label="Gift Recipient Country"
        isLabelExternal
        searchLabel="Search countries"
        name="countryId"
        value={selectedCountries}
        onChange={selected => {
          onChange(selected.map(({ id }) => id));
        }}
        options={countries}
        multiple
        disabled={disabled}
        classes={{
          popper: classes.popper,
          valueLabel: classes.countryValueLabel,
        }}
        buttonIconProps={{ fontSize: 0.8 }}
        showChips
        selectAllEnabled
      />
      {error?.message && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default memo(MarketplaceCountry);
