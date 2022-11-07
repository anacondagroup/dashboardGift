import React, { useEffect, useMemo } from 'react';
import { AlyceTheme } from '@alycecom/ui';
import { Box, FormControlProps, FormHelperText } from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { CommonData, CountriesPicker } from '@alycecom/modules';
import { makeStyles } from '@mui/styles';

import { useSwag } from '../../../hooks';
import { SwagDetailsFormFields, TSwagDetailsFormValues } from '../../../store/swagCampaign/swagCampaign.types';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  popper: {
    width: 400,
    minWidth: 400,
  },
  countryValueLabel: {
    color: palette.text.primary,
  },
}));

type TCountriesProps = FormControlProps & {
  control: Control<TSwagDetailsFormValues>;
};

const Countries = ({ control }: TCountriesProps): JSX.Element => {
  const { campaignId } = useSwag();
  const classes = useStyles();

  const countries = useSelector(CommonData.selectors.getNonInternationalCountries);

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({
    control,
    name: SwagDetailsFormFields.CountryIds,
  });
  const selectedCountries = useMemo(() => countries.filter(({ id }) => (value as number[]).includes(id)), [
    countries,
    value,
  ]);

  useEffect(() => {
    if (countries.length > 0 && !campaignId) {
      const defaultCountries = countries.slice(0, 1);
      onChange(defaultCountries.map(({ id }) => id));
    }
  }, [countries, campaignId, onChange]);

  return (
    <Box width={400} mb={5}>
      <CountriesPicker<true>
        label="Gift Recipient Country"
        isLabelExternal
        searchLabel="Search country"
        name={SwagDetailsFormFields.CountryIds}
        value={selectedCountries}
        onChange={selected => {
          onChange(selected.map(({ id }) => id));
        }}
        options={countries}
        multiple
        showChips
        classes={{
          popper: classes.popper,
          valueLabel: classes.countryValueLabel,
        }}
        buttonIconProps={{ fontSize: 0.8 }}
        listboxProps={{ maxVisibleRows: 4 }}
      />
      {error?.message && <FormHelperText error>{error?.message}</FormHelperText>}
    </Box>
  );
};

export default Countries;
