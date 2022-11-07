import React, { memo, useCallback, useMemo } from 'react';
import { Box, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Tooltip } from '@alycecom/ui';
import { Control, Controller, FieldError, useWatch, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';
import { pipe, prop } from 'ramda';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { Currencies, CurrencyConverter } from '@alycecom/modules';

import {
  getGiftCardGiftType,
  getIsGiftCardsBlockedByTeam,
  getIsGiftCardsAvailable,
} from '../../../store/entities/giftTypes/giftTypes.selectors';
import { GiftTypeCountries, RestrictedGiftType } from '../ActivateGiftTypes';
import { IMarketplaceFormValues, MarketplaceFormFields } from '../../../store/steps/gift';
import { GiftTypes } from '../../../store/entities/giftTypes/giftTypes.types';
import { useGetCampaignCountries } from '../../../hooks/useGetCampaignCountries';
import GiftCardsMarketplaceLink from '../../../../MarketplaceModule/components/Shared/GiftCardsMarketplaceLink';
import { getCountryIds } from '../../../store/steps/details';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  field: {
    width: 110,
    marginRight: spacing(3),
  },
  checkbox: {
    marginRight: spacing(1.25),
  },
  checkboxLabel: {
    width: 145,
    marginRight: spacing(1),
  },
  giftCardPreviewLink: {
    marginTop: spacing(1),
    marginBottom: spacing(4),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

export interface IActivateGiftCardPriceProps {
  control: Control<IMarketplaceFormValues>;
  trigger: UseFormTrigger<IMarketplaceFormValues>;
  setValue: UseFormSetValue<IMarketplaceFormValues>;
  error?: FieldError;
}

const ActivateGiftCardPrice = ({ control, trigger, setValue, error }: IActivateGiftCardPriceProps): JSX.Element => {
  const classes = useStyles();

  const restrictedGiftTypes = useWatch({ control, name: MarketplaceFormFields.GiftTypes });
  const watchFieldValue = useWatch({ control, name: MarketplaceFormFields.MaxGiftCardPrice });

  const isGiftCardsBlockedByTeam = useSelector(getIsGiftCardsBlockedByTeam);
  const isGiftCardsAvailable = useSelector(getIsGiftCardsAvailable);
  const giftType = useSelector(getGiftCardGiftType);
  const countryIds = useSelector(getCountryIds);

  const isGiftCardsChecked = useMemo(
    () =>
      !(restrictedGiftTypes || []).includes(GiftTypes.giftCard) && !isGiftCardsBlockedByTeam && isGiftCardsAvailable,
    [restrictedGiftTypes, isGiftCardsBlockedByTeam, isGiftCardsAvailable],
  );
  const isPriceBlocked = !isGiftCardsChecked || isGiftCardsBlockedByTeam || !isGiftCardsAvailable;

  const countries = useGetCampaignCountries();
  const isNeedToConvertGiftCardPrice = useMemo(
    () => isGiftCardsChecked && countries.some(country => country.currency.id !== Currencies.constants.USD_ID),
    [isGiftCardsChecked, countries],
  );
  const convertToCurrencyIds = useMemo(
    () =>
      countries
        .filter(country => country.currency.id !== Currencies.constants.USD_ID)
        .map(country => country.currency.id),
    [countries],
  );

  const handleSelectGiftCard = useCallback(
    (_, checked: boolean) => {
      const giftTypes = checked
        ? restrictedGiftTypes.filter((giftTypeId: EntityId) => giftTypeId !== GiftTypes.giftCard)
        : [...restrictedGiftTypes, GiftTypes.giftCard];
      setValue(MarketplaceFormFields.GiftTypes, giftTypes);
      trigger(MarketplaceFormFields.MaxGiftCardPrice);
      if (!checked) {
        setValue(MarketplaceFormFields.MaxGiftCardPrice, null, { shouldDirty: false });
      }
    },
    [setValue, restrictedGiftTypes, trigger],
  );

  return (
    <>
      <Box display="flex" width={1}>
        {isGiftCardsBlockedByTeam ? (
          <RestrictedGiftType width={140} height={48} display="flex" alignItems="center" title="Gift cards" />
        ) : (
          <Box display="flex" justifyContent="space-between" width={1} alignItems="center">
            <FormControlLabel
              className={classes.checkboxLabel}
              classes={{
                label: isGiftCardsAvailable ? 'H4-Chambray' : 'H4-Light',
              }}
              control={
                isGiftCardsAvailable ? (
                  <Checkbox
                    classes={{ root: classes.checkbox }}
                    checked={isGiftCardsChecked}
                    onChange={handleSelectGiftCard}
                    color="primary"
                    name="isGiftCardsAllowed"
                  />
                ) : (
                  <Tooltip
                    title="The gift type is not available for your selected countries yet. Check back soon."
                    placement="top-end"
                  >
                    <Checkbox classes={{ root: classes.checkbox }} checked={false} disabled name="isGiftCardsAllowed" />
                  </Tooltip>
                )
              }
              label="Gift cards"
            />
            {isGiftCardsAvailable && <GiftTypeCountries giftType={giftType} />}
          </Box>
        )}
      </Box>
      <Box mt={1} ml={5}>
        <Controller
          control={control}
          name={MarketplaceFormFields.MaxGiftCardPrice}
          render={({ field: { onChange, value } }) => (
            <ReactNumberFormat
              className={classes.field}
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
              label="Gift card price"
              error={!!error}
              helperText={error?.message}
              inputProps={{
                min: 0,
              }}
              disabled={isPriceBlocked}
              required={!isPriceBlocked}
            />
          )}
        />
        {isNeedToConvertGiftCardPrice && (
          <Box mt={1}>
            <CurrencyConverter.Component
              price={Number(watchFieldValue)}
              fromCurrencyId={Currencies.constants.USD_ID}
              toCurrencyIds={convertToCurrencyIds}
            />
          </Box>
        )}
        {isGiftCardsChecked && (
          <GiftCardsMarketplaceLink
            className={classes.giftCardPreviewLink}
            giftCardPrice={Number(watchFieldValue)}
            countryIds={countryIds || []}
          />
        )}
      </Box>
    </>
  );
};

export default memo(ActivateGiftCardPrice);
