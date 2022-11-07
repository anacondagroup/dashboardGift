import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Divider } from '@alycecom/ui';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import classNames from 'classnames';

import {
  exchangeMarketplaceSettingsDefaultValues,
  exchangeMarketplaceSettingsResolver,
  getInitialExchangeMarketplaceSettings,
  getIsLoading,
  IMarketplaceFormValues,
  MarketplaceFormFields,
  updateMarketplaceSettingsRequest,
} from '../../store/steps/gift';
import {
  getGiftTypesIdsRestrictedByTeam,
  getGiftTypeIdsUnavailableForCountries,
} from '../../store/entities/giftTypes/giftTypes.selectors';
import { getIsGiftBudgetBlocked } from '../../store/entities/giftTypes/giftTypes.helpers';

import { ActivateAllowedVendors } from './ActivateAllowedVendors';
import { ActivateGiftTypes } from './ActivateGiftTypes';
import { ActivateGiftCardPrice } from './ActivateGiftCardPrice';
import { ActivateMinPrice } from './ActivateMinPrice';
import { ActivateMaxPrice } from './ActivateMaxPrice';
import { ActivateDonationPrice } from './ActivateDonationPrice';

export interface IActivateMarketplaceFormProps {
  id?: number;
  onCancel: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: palette.grey.main,
    marginBottom: spacing(3),
    letterSpacing: 1,
  },
  buttonsWrapper: {
    zIndex: zIndex.appBar,
    position: 'fixed',
    bottom: 0,
    width: 550,
    backgroundColor: palette.divider,
    marginTop: spacing(4),
    padding: `${spacing(2)} ${spacing(3)}`,
    display: 'flex',
    flex: '0 0 76px',
    justifyContent: 'space-between',
  },
}));

const ActivateMarketplaceForm = ({ onCancel }: IActivateMarketplaceFormProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const initialExchangeMarketplaceValues = useSelector(getInitialExchangeMarketplaceSettings);
  const isLoading = useSelector(getIsLoading);

  const restrictedByTeamGiftTypeIds = useSelector(getGiftTypesIdsRestrictedByTeam);
  const unavailableGiftTypeIds = useSelector(getGiftTypeIdsUnavailableForCountries);

  const methods = useForm<IMarketplaceFormValues>({
    mode: 'all',
    defaultValues: exchangeMarketplaceSettingsDefaultValues,
    resolver: exchangeMarketplaceSettingsResolver,
    context: { restrictedByTeamGiftTypeIds, unavailableGiftTypeIds },
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, errors },
    trigger,
    setValue,
  } = methods;

  const handleSaveMarketplace = useCallback(
    ({ allowedVendors: { restrictedBrandIds, restrictedMerchantIds }, ...rest }: IMarketplaceFormValues) => {
      dispatch(
        updateMarketplaceSettingsRequest({
          ...rest,
          restrictedBrandIds,
          restrictedMerchantIds,
        }),
      );
    },
    [dispatch],
  );

  const restrictedGiftTypeIds = watch(MarketplaceFormFields.GiftTypes);
  const isGiftBudgetBlocked = useMemo(
    () => getIsGiftBudgetBlocked(restrictedGiftTypeIds || [], restrictedByTeamGiftTypeIds, unavailableGiftTypeIds),
    [restrictedGiftTypeIds, restrictedByTeamGiftTypeIds, unavailableGiftTypeIds],
  );

  useEffect(() => {
    if (initialExchangeMarketplaceValues) {
      reset(initialExchangeMarketplaceValues);
    }
  }, [reset, initialExchangeMarketplaceValues]);

  const isApplyButtonDisabled = isLoading || (initialExchangeMarketplaceValues && !isValid);

  return (
    <form onSubmit={handleSubmit(handleSaveMarketplace)}>
      <FormProvider {...methods}>
        <Box p={3} flex="1 1 auto" mb={16}>
          <Box className={classes.sectionTitle} mt={1} mb={2}>
            Gift types
          </Box>
          <Box display="flex" justifyContent="space-between" mt={3} mb={1.5} ml={3.5} mr={6}>
            <Box className={classNames('Label-Table-Left-Active', 'Text-Uppercase')}>Name</Box>
            <Box className={classNames('Label-Table-Left-Active', 'Text-Uppercase')}>Country</Box>
          </Box>
          <Divider mb={2} />
          <Controller
            name={MarketplaceFormFields.GiftTypes}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ActivateGiftTypes setValue={setValue} value={value} trigger={trigger} onChange={onChange} />
            )}
          />
          <Box display="flex" mt={9} ml={5}>
            <ActivateMinPrice
              isBlocked={isGiftBudgetBlocked}
              control={control}
              trigger={trigger}
              error={errors[MarketplaceFormFields.MinBudgetPrice]}
            />
            <ActivateMaxPrice
              isBlocked={isGiftBudgetBlocked}
              control={control}
              trigger={trigger}
              error={errors[MarketplaceFormFields.MaxBudgetPrice]}
            />
          </Box>
          <Divider mt={3} mb={3} />
          <ActivateGiftCardPrice
            control={control}
            trigger={trigger}
            setValue={setValue}
            error={errors[MarketplaceFormFields.MaxGiftCardPrice]}
          />
          <Divider mt={3} mb={3} />
          <ActivateDonationPrice
            control={control}
            trigger={trigger}
            setValue={setValue}
            error={errors[MarketplaceFormFields.DonationPrice]}
          />
          <Box className={classes.sectionTitle} mt={5} mb={2}>
            Allowed vendors
          </Box>
          <Controller
            name={MarketplaceFormFields.AllowedVendors}
            control={control}
            render={({ field: { onChange, value } }) => <ActivateAllowedVendors value={value} onChange={onChange} />}
          />
        </Box>
        <Box className={classes.buttonsWrapper}>
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="secondary" type="submit" disabled={isApplyButtonDisabled}>
            Apply changes
          </Button>
        </Box>
      </FormProvider>
    </form>
  );
};

export default ActivateMarketplaceForm;
