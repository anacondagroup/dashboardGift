import React, { useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useModalState } from '@alycecom/hooks';
import { omit, without, uniq } from 'ramda';
import ReactNumberFormat from 'react-number-format';
import { Divider, Icon, Button as AlyceButton } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Checkbox,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { ProductTypes } from '../../../../../../store/settings.types';
import { fetchProductTypes } from '../../../../../../../MarketplaceModule/store/entities/productTypes/productTypes.actions';
import {
  getIsLoaded as getIsProductTypesLoaded,
  getIsLoading as getIsProductTypesLoading,
  getProductTypes,
} from '../../../../../../../MarketplaceModule/store/entities/productTypes/productTypes.selectors';
import { ExchangeOptions } from '../../../../../../../../constants/swagSelect.constants';
import { fetchTeamSettings } from '../../../../../../../MarketplaceModule/store/teamSettings/teamSettings.actions';
import { getRestrictedTypeIds } from '../../../../../../../MarketplaceModule/store/teamSettings/teamSettings.selectors';
import InfoTooltip from '../../../../../../../ActivateModule/components/InfoTooltip';

import SwagVendorRestrictionController from './SwagVendorRestrictionController';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 145,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.link.main,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 0,
  },
}));

const swagBudgetSchema = yup.object().shape(
  {
    minGiftAmount: yup
      .number()
      .default(null)
      .nullable()
      .label('Minimum')
      .positive()
      .integer()
      .min(0)
      .max(yup.ref('maxGiftAmount'), ({ label }) => `${label} should be less than or equal "Max gift amount"`)
      .when('isPhysicalEnabled', (isEnabled, schema) => (isEnabled ? schema.required() : schema)),
    maxGiftAmount: yup
      .number()
      .default(null)
      .nullable()
      .label('Maximum')
      .positive()
      .integer()
      .min(yup.ref('minGiftAmount'), ({ label }) => `${label} should be greater than or equal "Min gift amount"`)
      .max(5000)
      .when('isPhysicalEnabled', (isEnabled, schema) => (isEnabled ? schema.required() : schema)),
    donationMaxAmount: yup
      .number()
      .nullable()
      .default(null)
      .label('Amount')
      .min(0)
      .max(5000)
      .when('isDonationsEnabled', (isEnabled, schema) => (isEnabled ? schema.required() : schema)),
    giftCardMaxAmount: yup
      .number()
      .nullable()
      .default(null)
      .label('Max Amount')
      .min(0)
      .max(5000)
      .when('isCardsEnabled', (isEnabled, schema) => (isEnabled ? schema.required() : schema)),
    restrictedProductTypeIds: yup
      .array()
      .default([])
      .when('$productTypesCount', (count, schema) =>
        schema.max((count || 1) - 1, 'One of the product types should be permitted'),
      ),
    isDonationsEnabled: yup.boolean().default(false),
    isCardsEnabled: yup.boolean().default(false),
    isPhysicalEnabled: yup.boolean().default(true),
    restrictedVendors: yup
      .object()
      .shape({
        brandIds: yup.array().default([]),
        merchantIds: yup.array().default([]),
      })
      .default({ brandIds: [], merchantIds: [] }),
  },
  ['minGiftAmount', 'maxGiftAmount'],
);

const swagBudgetSchemaResolver = yupResolver(swagBudgetSchema);
const swagBudgetSchemaDefaultValues = swagBudgetSchema.getDefault();

const DEFAULT_RESTRICTED_PRODUCT_TYPES = [
  ProductTypes.donation,
  ProductTypes.eGift,
  ProductTypes.experience,
  ProductTypes.onDemand,
  ProductTypes.physical,
  ProductTypes.subscription,
];

const SwagGiftBudgetForm = ({
  onSubmit,
  teamId,
  isLoading = false,
  defaultValues = undefined,
  submitButton = undefined,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const productTypes = useSelector(getProductTypes);
  const restrictedTypeIds = useSelector(getRestrictedTypeIds);
  const defaultRestrictedTypeIds = useMemo(() => uniq([...DEFAULT_RESTRICTED_PRODUCT_TYPES, ...restrictedTypeIds]), [
    restrictedTypeIds,
  ]);
  const isProductTypesLoading = useSelector(getIsProductTypesLoading);
  const isProductTypesLoaded = useSelector(getIsProductTypesLoaded);
  const physicalProductTypes = useMemo(
    () => productTypes.filter(type => ![ProductTypes.donation, ProductTypes.eGift].includes(type.id)),
    [productTypes],
  );
  const { isOpen, handleOpen, handleClose } = useModalState();

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { isDirty, errors },
    setValue,
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: swagBudgetSchemaDefaultValues,
    resolver: swagBudgetSchemaResolver,
    shouldUnregister: false,
    context: {
      productTypesCount: productTypes.length,
    },
  });
  const [isDonationsEnabled, isCardsEnabled, restrictedVendors, restrictedProductTypeIds] = watch([
    'isDonationsEnabled',
    'isCardsEnabled',
    'restrictedVendors',
    'restrictedProductTypeIds',
  ]);
  const isPhysicalEnabled = useMemo(
    () => !physicalProductTypes.every(type => restrictedProductTypeIds.includes(type.id)),
    [restrictedProductTypeIds, physicalProductTypes],
  );
  const restrictedTotal = (restrictedVendors.brandIds?.length ?? 0) + (restrictedVendors.merchantIds?.length ?? 0);

  useEffect(() => {
    dispatch(fetchTeamSettings({ teamId }));
  }, [dispatch, teamId]);

  useEffect(() => {
    setValue('isPhysicalEnabled', isPhysicalEnabled, { shouldValidate: true });

    if (!isPhysicalEnabled) {
      setValue('minGiftAmount', null, { shouldValidate: true });
      setValue('maxGiftAmount', null, { shouldValidate: true });
    }
  }, [setValue, isPhysicalEnabled]);

  useEffect(() => {
    if (!isProductTypesLoaded && !isProductTypesLoading) {
      dispatch(fetchProductTypes());
    }
  }, [dispatch, isProductTypesLoaded, isProductTypesLoading]);

  useEffect(() => {
    const {
      exchangeOption,
      restrictedBrandIds = [],
      restrictedMerchantIds = [],
      restrictedProductTypeIds: rTypeIds,
      minGiftAmount,
      maxGiftAmount,
      donationMaxAmount,
      giftCardMaxAmount,
      ...formValues
    } = defaultValues || {};
    const finalRestrictedTypeIds =
      exchangeOption !== ExchangeOptions.Budget ? defaultRestrictedTypeIds : uniq([...rTypeIds, ...restrictedTypeIds]);
    const isDonationsProductsEnabled = !finalRestrictedTypeIds?.includes(ProductTypes.donation);
    const isCardsProductsEnabled = !finalRestrictedTypeIds?.includes(ProductTypes.eGift);
    const isPhysicalProductsEnabled = !physicalProductTypes.every(type => finalRestrictedTypeIds?.includes(type.id));
    reset({
      restrictedVendors: {
        brandIds: restrictedBrandIds,
        merchantIds: restrictedMerchantIds,
      },
      restrictedProductTypeIds: finalRestrictedTypeIds,
      isDonationsEnabled: isDonationsProductsEnabled,
      isCardsEnabled: isCardsProductsEnabled,
      isPhysicalEnabled: isPhysicalProductsEnabled,
      minGiftAmount: isPhysicalProductsEnabled ? minGiftAmount : null,
      maxGiftAmount: isPhysicalProductsEnabled ? maxGiftAmount : null,
      donationMaxAmount: isDonationsProductsEnabled ? donationMaxAmount : null,
      giftCardMaxAmount: isCardsProductsEnabled ? giftCardMaxAmount : null,
      ...formValues,
    });
  }, [defaultValues, reset, defaultRestrictedTypeIds, physicalProductTypes, restrictedTypeIds]);

  const isNextDisabled = isLoading;

  const onFormSubmit = useCallback(
    form => {
      onSubmit({
        formValues: omit(['isDonationsEnabled', 'isCardsEnabled', 'isPhysicalEnabled', 'restrictedVendors'], {
          ...form,
          restrictedMerchantIds: form.restrictedVendors.merchantIds,
          restrictedBrandIds: form.restrictedVendors.brandIds,
          customMarketplaceId: null,
          exchangeOption: ExchangeOptions.Budget,
        }),
        isDirty,
      });
    },
    [isDirty, onSubmit],
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
      <Typography variant="h6" gutterBottom>
        Specify Gift Options
      </Typography>
      <FormControl error={!!errors.restrictedProductTypeIds}>
        <FormLabel>GIFT TYPES</FormLabel>
        {!isProductTypesLoading ? (
          <Controller
            control={control}
            name="restrictedProductTypeIds"
            render={({ field: { onChange, value = [] } }) => (
              <FormGroup>
                {physicalProductTypes.map(productType => {
                  const isDisabled = restrictedTypeIds.includes(productType.id);
                  return (
                    <FormControlLabel
                      key={productType.id}
                      disabled={isDisabled}
                      control={
                        <Checkbox
                          icon={isDisabled ? <Icon icon="lock" /> : undefined}
                          color="primary"
                          checked={!value?.includes(productType.id) && !isDisabled}
                        />
                      }
                      onChange={(event, isChecked) => {
                        if (isChecked) {
                          onChange(without([productType.id], value));
                        } else {
                          onChange([...value, productType.id]);
                        }
                      }}
                      label={
                        <>
                          {productType.label}
                          {isDisabled && (
                            <InfoTooltip ml={1}>This type restricted on your team-level settings</InfoTooltip>
                          )}
                        </>
                      }
                    />
                  );
                })}
              </FormGroup>
            )}
          />
        ) : (
          <FormGroup>
            {Array.from({ length: 5 }, (_, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox color="primary" disabled />}
                label={<Skeleton variant="text" width={100} />}
              />
            ))}
          </FormGroup>
        )}
      </FormControl>
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="minGiftAmount"
            render={({ field: { onChange, value, onBlur } }) => (
              <ReactNumberFormat
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                thousandSeparator
                prefix="$"
                placeholder="$"
                InputLabelProps={{ shrink: true }}
                error={!!errors?.minGiftAmount}
                helperText={errors?.minGiftAmount?.message}
                disabled={!isPhysicalEnabled}
                label={`Minimum${isPhysicalEnabled ? ' *' : ''}`}
                variant="outlined"
                margin="normal"
                inputProps={{
                  min: 0,
                }}
                value={value === null ? '' : value}
                onValueChange={({ floatValue }) => {
                  onChange(floatValue);
                  trigger('maxGiftAmount');
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="maxGiftAmount"
            render={({ field: { onChange, value, onBlur } }) => (
              <ReactNumberFormat
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                thousandSeparator
                prefix="$"
                placeholder="$"
                InputLabelProps={{ shrink: true }}
                error={!!errors?.maxGiftAmount}
                helperText={errors?.maxGiftAmount?.message}
                disabled={!isPhysicalEnabled}
                label={`Maximum${isPhysicalEnabled ? ' *' : ''}`}
                variant="outlined"
                margin="normal"
                inputProps={{
                  min: 0,
                }}
                value={value === null ? '' : value}
                onValueChange={({ floatValue }) => {
                  onChange(floatValue);
                  trigger('minGiftAmount');
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
      <Divider my={2} />
      <Grid container spacing={8} alignItems="center">
        <Grid item xs={4}>
          <Controller
            control={control}
            name="isCardsEnabled"
            render={({ field: { onChange, value } }) => {
              const isDisabled = restrictedTypeIds.includes(ProductTypes.eGift);
              return (
                <FormControlLabel
                  disabled={isDisabled}
                  control={
                    <Checkbox
                      color="primary"
                      icon={isDisabled ? <Icon icon="lock" /> : undefined}
                      onChange={(event, isChecked) => {
                        onChange(isChecked);
                        if (!isChecked) {
                          setValue('giftCardMaxAmount', null, { shouldValidate: true });
                          setValue('restrictedProductTypeIds', [...restrictedProductTypeIds, ProductTypes.eGift], {
                            shouldValidate: true,
                          });
                        } else if (isChecked) {
                          setValue(
                            'restrictedProductTypeIds',
                            without([ProductTypes.eGift], restrictedProductTypeIds),
                            { shouldValidate: true },
                          );
                        }
                      }}
                      checked={value && !isDisabled}
                    />
                  }
                  label={
                    <>
                      Gift Cards
                      {isDisabled && <InfoTooltip ml={1}>This type restricted on your team-level settings</InfoTooltip>}
                    </>
                  }
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="giftCardMaxAmount"
            render={({ field: { onChange, value, onBlur } }) => (
              <ReactNumberFormat
                disabled={!isCardsEnabled}
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                prefix="$"
                placeholder="$"
                InputLabelProps={{ shrink: true }}
                error={!!errors?.giftCardMaxAmount}
                helperText={errors?.giftCardMaxAmount?.message}
                label={`Max Amount${isCardsEnabled ? ' *' : ''}`}
                variant="outlined"
                margin="normal"
                value={value === null ? '' : value}
                onValueChange={({ floatValue }) => {
                  onChange(floatValue);
                }}
                inputProps={{
                  min: 0,
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
      <Divider my={2} />
      <Grid container spacing={8} alignItems="center">
        <Grid item xs={4}>
          <Controller
            control={control}
            name="isDonationsEnabled"
            render={({ field: { onChange, value } }) => {
              const isDisabled = restrictedTypeIds.includes(ProductTypes.donation);
              return (
                <FormControlLabel
                  disabled={isDisabled}
                  control={
                    <Checkbox
                      color="primary"
                      icon={isDisabled ? <Icon icon="lock" /> : undefined}
                      onChange={(event, isChecked) => {
                        onChange(isChecked);
                        if (!isChecked) {
                          setValue('donationMaxAmount', null, { shouldValidate: true });
                          setValue('restrictedProductTypeIds', [...restrictedProductTypeIds, ProductTypes.donation], {
                            shouldValidate: true,
                          });
                        } else if (isChecked) {
                          setValue(
                            'restrictedProductTypeIds',
                            without([ProductTypes.donation], restrictedProductTypeIds),
                            { shouldValidate: true },
                          );
                        }
                      }}
                      checked={value && !isDisabled}
                    />
                  }
                  label={
                    <>
                      Donations
                      {isDisabled && <InfoTooltip ml={1}>This type restricted on your team-level settings</InfoTooltip>}
                    </>
                  }
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="donationMaxAmount"
            render={({ field: { onChange, value, onBlur } }) => (
              <ReactNumberFormat
                disabled={!isDonationsEnabled}
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                prefix="$"
                placeholder="$"
                InputLabelProps={{ shrink: true }}
                error={!!errors?.donationMaxAmount}
                helperText={errors?.donationMaxAmount?.message}
                label={`Amount${isDonationsEnabled ? ' *' : ''}`}
                variant="outlined"
                margin="normal"
                value={value === null ? '' : value}
                onValueChange={({ floatValue }) => {
                  onChange(floatValue);
                }}
                inputProps={{
                  min: 0,
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
      {!!errors.restrictedProductTypeIds?.message && (
        <FormHelperText error>{errors.restrictedProductTypeIds?.message}</FormHelperText>
      )}
      <Controller
        control={control}
        name="restrictedVendors"
        render={({ field: { value, onChange } }) => (
          <SwagVendorRestrictionController
            teamId={teamId}
            onChange={onChange}
            value={value}
            onClose={handleClose}
            open={isOpen}
          />
        )}
      />
      <Box pt={4}>
        <AlyceButton
          className={classes.linkButton}
          disableRipple
          variant="text"
          color="default"
          onClick={handleOpen}
          endIcon={<Icon icon="chevron-right" />}
        >
          Add Vendor Restrictions
        </AlyceButton>
        {restrictedTotal !== 0 && (
          <FormHelperText>
            Restricted {restrictedTotal} vendor{restrictedTotal > 1 && 's'}
          </FormHelperText>
        )}
      </Box>
      {submitButton || (
        <Box width="100%" mt={2} display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            fullWidth
            disabled={isNextDisabled}
            type="submit"
          >
            Next step
            {isLoading ? (
              <Icon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            ) : (
              <Icon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

SwagGiftBudgetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  submitButton: PropTypes.node,
  isLoading: PropTypes.bool,
  defaultValues: PropTypes.shape({
    restrictedMerchantIds: PropTypes.arrayOf(PropTypes.number),
    restrictedBrandIds: PropTypes.arrayOf(PropTypes.number),
    restrictedProductTypeIds: PropTypes.arrayOf(PropTypes.number),
    minGiftAmount: PropTypes.number,
    maxGiftAmount: PropTypes.number,
    giftCardMaxAmount: PropTypes.number,
    donationMaxAmount: PropTypes.number,
  }),
};

SwagGiftBudgetForm.defaultProps = {
  isLoading: false,
  submitButton: undefined,
  defaultValues: {
    restrictedMerchantIds: [],
    restrictedBrandIds: [],
    restrictedProductTypeIds: [],
    minGiftAmount: null,
    maxGiftAmount: null,
    giftCardMaxAmount: null,
    donationMaxAmount: null,
  },
};

export default SwagGiftBudgetForm;
