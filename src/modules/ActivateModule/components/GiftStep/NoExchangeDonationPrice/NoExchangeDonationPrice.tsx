import React, { useEffect, useRef, useState } from 'react';
import { pipe, prop } from 'ramda';
import { formLabelClasses, outlinedInputClasses, TextField, Theme } from '@mui/material';
import ReactNumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { number, ValidationError } from 'yup';
import { useDebounce } from 'react-use';

import {
  getDefaultGift,
  getDonationSetting,
  getIsLoaded,
  updateAcceptOnlyDonationSetting,
} from '../../../store/steps/gift';
import { useActivate } from '../../../hooks/useActivate';
import { loadDefaultGiftProductsRequest } from '../../../store/entities/defaultGiftProducts/defaultGiftProducts.actions';
import { getDefaultGiftProducts } from '../../../store/entities/defaultGiftProducts/defaultGiftProducts.selectors';

const DEFAULT_EXCHANGE_DONATION_PRICE = 50;

const schema = number()
  .default(null)
  .label('Donation Amount')
  .nullable()
  .positive()
  .integer()
  .required()
  .min(1)
  .max(5000);

const styles = {
  root: {
    [`& .${outlinedInputClasses.root}`]: {
      color: ({ palette }: Theme) => palette.primary.main,
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderWidth: 1,
      borderColor: ({ palette }: Theme) => palette.grey.chambray50,
    },
    [`& .${formLabelClasses.root}`]: {
      color: ({ palette }: Theme) => palette.primary.main,
    },
  },
} as const;

const NoExchangeDonationPrice = (): JSX.Element => {
  const dispatch = useDispatch();
  const isMountedRef = useRef(false);

  const { campaignId } = useActivate();

  const isLoaded = useSelector(getIsLoaded);
  const defaultGift = useSelector(getDefaultGift);
  const [defaultProduct] = useSelector(getDefaultGiftProducts);

  const donationSetting = useSelector(getDonationSetting);
  const defaultPrice = defaultProduct ? defaultProduct?.localPrice?.price : null;
  const [error, setError] = useState<ValidationError | null>(null);
  const [donationPriceValue, onDonationPriceChange] = useState<number | null | undefined>(schema.getDefault());

  useEffect(() => {
    if (campaignId && defaultGift && !isMountedRef.current) {
      dispatch(loadDefaultGiftProductsRequest({ campaignId }));
    }
  }, [dispatch, campaignId, defaultGift, isMountedRef]);

  useEffect(() => {
    if (typeof donationSetting?.amount === 'number') {
      onDonationPriceChange(donationSetting.amount);
    }
  }, [onDonationPriceChange, donationSetting]);

  useEffect(() => {
    if (!defaultGift && !defaultPrice && !donationSetting && isLoaded) {
      onDonationPriceChange(DEFAULT_EXCHANGE_DONATION_PRICE);
    }
  }, [defaultPrice, onDonationPriceChange, isLoaded, donationSetting, defaultGift]);

  useEffect(() => {
    if (
      defaultGift &&
      defaultPrice &&
      typeof donationPriceValue !== 'number' &&
      typeof donationSetting?.amount !== 'number' &&
      !isMountedRef.current &&
      isLoaded
    ) {
      onDonationPriceChange(Math.round(Number(defaultPrice)));
      isMountedRef.current = true;
    }
  }, [defaultPrice, donationPriceValue, onDonationPriceChange, isLoaded, donationSetting, defaultGift]);

  useEffect(() => {
    try {
      schema.validateSync(donationPriceValue);
      setError(null);
    } catch (e) {
      setError(e);
    }
  }, [donationPriceValue]);

  useDebounce(
    () => {
      if (schema.isValidSync(donationPriceValue) && donationSetting?.amount !== donationPriceValue) {
        dispatch(updateAcceptOnlyDonationSetting(donationPriceValue));
      }
    },
    500,
    [dispatch, donationPriceValue, donationSetting],
  );

  return (
    <ReactNumberFormat
      sx={styles.root}
      onValueChange={pipe(prop('floatValue'), onDonationPriceChange)}
      value={donationPriceValue}
      decimalScale={0}
      allowNegative={false}
      customInput={TextField}
      thousandSeparator
      prefix="$"
      placeholder="$"
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      label="Donation Amount"
      error={!!error}
      helperText={error?.message}
      inputProps={{
        name: 'donationPrice',
      }}
    />
  );
};

export default NoExchangeDonationPrice;
