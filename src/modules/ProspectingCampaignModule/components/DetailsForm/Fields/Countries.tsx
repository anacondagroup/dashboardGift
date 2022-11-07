import React, { Fragment, useEffect, useMemo } from 'react';
import { AlyceTheme } from '@alycecom/ui';
import { Box, FormControlProps, FormHelperText } from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { CommonData, CountriesPicker, Features } from '@alycecom/modules';
import { makeStyles } from '@mui/styles';

import {
  TDetailsFormValues,
  DetailsFormFields,
} from '../../../store/prospectingCampaign/steps/details/details.schemas';
import { useProspecting } from '../../../hooks';
import { SFormLabel } from '../../styled/Styled';

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
  control: Control<TDetailsFormValues>;
};

const Countries = ({ control }: TCountriesProps): JSX.Element => {
  const { campaignId, isEditor } = useProspecting();
  const classes = useStyles();

  const hasInternational = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.INTERNATIONAL), []),
  );

  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetAvailableCountries(hasInternational), [hasInternational]),
  );

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({
    control,
    name: DetailsFormFields.CountryIds,
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
      {isEditor ? (
        <>
          <SFormLabel sx={{ pb: 1 }}>Gift Recipient Country</SFormLabel>
          <Box>
            {selectedCountries.map((country, idx) => (
              <Fragment key={country.id}>
                {idx !== 0 && ', '}
                <Box color="primary.main" display="inline">
                  {country.name}
                </Box>
              </Fragment>
            ))}
          </Box>
        </>
      ) : (
        <>
          <CountriesPicker<true>
            label="Gift Recipient Country"
            isLabelExternal
            searchLabel="Search country"
            name={DetailsFormFields.CountryIds}
            value={selectedCountries}
            onChange={selected => {
              onChange(selected.map(({ id }) => id));
            }}
            options={countries}
            disabled={isEditor}
            multiple
            showChips
            classes={{
              popper: classes.popper,
              valueLabel: classes.countryValueLabel,
            }}
            buttonIconProps={{ fontSize: 0.8 }}
            listboxProps={{ maxVisibleRows: 4 }}
            selectAllEnabled
          />
          {error?.message && <FormHelperText error>{error?.message}</FormHelperText>}
        </>
      )}
    </Box>
  );
};

export default Countries;
