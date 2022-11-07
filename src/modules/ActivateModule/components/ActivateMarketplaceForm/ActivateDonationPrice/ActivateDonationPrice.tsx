import React, { memo, useCallback, useMemo } from 'react';
import { Box, FormControlLabel, Checkbox, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Tooltip } from '@alycecom/ui';
import { Control, Controller, FieldError, UseFormSetValue, UseFormTrigger, useWatch } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';
import { pipe, prop } from 'ramda';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';

import {
  getDonationGiftType,
  getIsDonationsBlockedByTeam,
  getIsDonationsAvailable,
} from '../../../store/entities/giftTypes/giftTypes.selectors';
import { GiftTypeCountries, RestrictedGiftType } from '../ActivateGiftTypes';
import { IMarketplaceFormValues, MarketplaceFormFields } from '../../../store/steps/gift';
import { GiftTypes } from '../../../store/entities/giftTypes/giftTypes.types';
import { useGetCampaignCountries } from '../../../hooks/useGetCampaignCountries';

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
}));

export interface IActivateDonationPriceProps {
  error?: FieldError;
  control: Control<IMarketplaceFormValues>;
  trigger: UseFormTrigger<IMarketplaceFormValues>;
  setValue: UseFormSetValue<IMarketplaceFormValues>;
}

const ActivateDonationPrice = ({ control, error, setValue, trigger }: IActivateDonationPriceProps): JSX.Element => {
  const classes = useStyles();

  const restrictedGiftTypes = useWatch({ control, name: MarketplaceFormFields.GiftTypes });

  const isDonationsBlockedByTeam = useSelector(getIsDonationsBlockedByTeam);
  const isDonationsAvailable = useSelector(getIsDonationsAvailable);
  const giftType = useSelector(getDonationGiftType);

  const isDonationsChecked = useMemo(
    () =>
      !(restrictedGiftTypes || []).includes(GiftTypes.donation) && !isDonationsBlockedByTeam && isDonationsAvailable,
    [restrictedGiftTypes, isDonationsBlockedByTeam, isDonationsAvailable],
  );
  const isPriceBlocked = !isDonationsChecked || isDonationsBlockedByTeam || !isDonationsAvailable;

  const countries = useGetCampaignCountries();
  const isInternational = useMemo(() => countries.some(country => country.isInternational), [countries]);

  const handleSelectGiftCard = useCallback(
    (_, checked: boolean) => {
      const giftTypes = checked
        ? restrictedGiftTypes.filter((giftTypeId: EntityId) => giftTypeId !== GiftTypes.donation)
        : [...restrictedGiftTypes, GiftTypes.donation];
      setValue(MarketplaceFormFields.GiftTypes, giftTypes);
      trigger(MarketplaceFormFields.DonationPrice);
      if (!checked) {
        setValue(MarketplaceFormFields.DonationPrice, null, { shouldDirty: false });
      }
    },
    [setValue, trigger, restrictedGiftTypes],
  );

  return (
    <>
      <Box display="flex" width={1}>
        {isDonationsBlockedByTeam ? (
          <RestrictedGiftType width={140} height={48} display="flex" alignItems="center" title="Donations" />
        ) : (
          <Box display="flex" justifyContent="space-between" width={1} alignItems="center">
            <FormControlLabel
              className={classes.checkboxLabel}
              classes={{
                label: isDonationsAvailable ? 'H4-Chambray' : 'H4-Light',
              }}
              control={
                isDonationsAvailable ? (
                  <Checkbox
                    classes={{ root: classes.checkbox }}
                    checked={isDonationsChecked}
                    onChange={handleSelectGiftCard}
                    color="primary"
                    name="isDonationAllowed"
                  />
                ) : (
                  <Tooltip
                    title="The gift type is not available for your selected countries yet. Check back soon."
                    placement="top-end"
                  >
                    <Checkbox classes={{ root: classes.checkbox }} checked={false} disabled name="isDonationAllowed" />
                  </Tooltip>
                )
              }
              label="Donations"
            />
            {isDonationsAvailable && <GiftTypeCountries giftType={giftType} />}
          </Box>
        )}
      </Box>
      <Box mt={1} ml={5}>
        <Controller
          control={control}
          name={MarketplaceFormFields.DonationPrice}
          render={({ field: { value, onChange } }) => (
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
              label="Amount"
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
      </Box>
      {isInternational && (
        <Box mt={1}>
          <Typography className="Body-Regular-Left-Static">Donations are available in $ only</Typography>
        </Box>
      )}
    </>
  );
};

export default memo(ActivateDonationPrice);
