import React, { memo, useMemo } from 'react';
import ReactNumberFormat from 'react-number-format';
import { pipe, prop } from 'ramda';
import { Box, Collapse, TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { CommonData, Currencies, CurrencyConverter } from '@alycecom/modules';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const GiftCardPrice = ({ control, error }: IFieldProps): JSX.Element => {
  const isGiftCardsAllowed = useWatch({ name: CustomMarketplaceField.IsGiftCardsAllowed, control });
  const countryIds = useWatch({ name: CustomMarketplaceField.CountryIds, control });

  const currencies = useSelector(
    useMemo(() => CommonData.selectors.makeGetCurrencyIdsByCountryIds(countryIds || []), [countryIds]),
  );
  const nonUsdCurrencies = useMemo(() => currencies.filter(currencyId => currencyId !== Currencies.constants.USD_ID), [
    currencies,
  ]);
  const isConverterEnabled = !!nonUsdCurrencies.length;

  return (
    <Controller
      control={control}
      name={CustomMarketplaceField.GiftCardPrice}
      render={({ field: { onChange, value } }) => (
        <>
          <Box maxWidth={200}>
            <ReactNumberFormat
              onValueChange={pipe(prop('floatValue'), onChange)}
              decimalScale={0}
              allowNegative={false}
              customInput={TextField}
              thousandSeparator
              prefix="$"
              placeholder="$"
              InputLabelProps={{ shrink: true }}
              value={value === null ? '' : value}
              variant="outlined"
              label="Gift сard price"
              error={!!error}
              helperText={error}
              disabled={!isGiftCardsAllowed}
              inputProps={{
                min: 0,
              }}
            />
          </Box>
          <Collapse in={isConverterEnabled && value !== null} mountOnEnter unmountOnExit>
            <Box mt={1}>
              <CurrencyConverter.Component
                price={value ?? 0}
                fromCurrencyId={Currencies.constants.USD_ID}
                toCurrencyIds={nonUsdCurrencies}
              />
            </Box>
          </Collapse>
        </>
      )}
    />
  );
};

export default memo(GiftCardPrice);
