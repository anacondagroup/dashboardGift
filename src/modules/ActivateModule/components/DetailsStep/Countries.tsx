import React, { useEffect, useMemo } from 'react';
import { AlyceTheme } from '@alycecom/ui';
import { Box, FormControlProps, FormHelperText } from '@mui/material';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { CommonData, CountriesPicker, Features } from '@alycecom/modules';
import { makeStyles } from '@mui/styles';

import { IDetailsFormValues } from '../../store/steps/details/detailsForm.schemas';
import { getActivateModuleParams } from '../../store/activate.selectors';
import { ActivateModes } from '../../routePaths';

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
  name: keyof IDetailsFormValues;
  control: Control<IDetailsFormValues>;
  setValue: UseFormSetValue<IDetailsFormValues>;
  draftId: number | null;
};

const Countries = ({ name, draftId, control, setValue, error }: TCountriesProps): JSX.Element => {
  const classes = useStyles();

  const { mode } = useSelector(getActivateModuleParams);
  const hasInternational = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.INTERNATIONAL), []),
  );

  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetAvailableCountries(hasInternational), [hasInternational]),
  );

  useEffect(() => {
    if (countries.length > 0 && !draftId) {
      const defaultCountries = countries.filter(
        ({ id }) => id === CommonData.COUNTRIES.US.id || id === CommonData.COUNTRIES.CA.id,
      );
      setValue(
        name,
        defaultCountries.map(({ id }) => id),
      );
    }
  }, [countries, draftId, name, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Box width={400} mb={5}>
          <CountriesPicker<true>
            label="Gift Recipient Country"
            isLabelExternal
            searchLabel="Search country"
            name={name}
            value={countries.filter(({ id }) => (value as number[]).includes(id))}
            onChange={selected => {
              onChange(selected.map(({ id }) => id));
            }}
            options={countries}
            disabled={mode === ActivateModes.Editor}
            multiple
            showChips
            classes={{
              popper: classes.popper,
              valueLabel: classes.countryValueLabel,
            }}
            buttonIconProps={{ fontSize: 0.8 }}
            listboxProps={{ maxVisibleRows: 4 }}
          />
          {error && (
            <FormHelperText error className={classes.countryErrorLabel}>
              {error}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default Countries;
