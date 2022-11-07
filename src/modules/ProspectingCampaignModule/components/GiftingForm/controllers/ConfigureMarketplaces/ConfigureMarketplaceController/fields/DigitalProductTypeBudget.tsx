import React, { useEffect, useMemo, memo, ReactNode } from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, Checkbox, Collapse, FormControl, FormControlLabel, Grid, TextField } from '@mui/material';
import { Icon, Tooltip } from '@alycecom/ui';
import ReactNumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { without } from 'ramda';
import { CommonData, Currencies, CurrencyConverter, CampaignSettings } from '@alycecom/modules';

import { ProductTypes } from '../../../../../../../SettingsModule/store/settings.types';
import { getDetailsData } from '../../../../../../store/prospectingCampaign/steps/details/details.selectors';
import { useTeamProductTypes } from '../../../../../../../MarketplaceModule/hooks/useTeamProductTypes';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export interface IDigitalProductTypeBudgeChildRendererProps {
  enabled: boolean;
  value: number | null;
}

export interface IDigitalProductTypeBudgetProps {
  control: Control<TProspectingGiftingForm>;
  name: MarketplaceDataFields.GiftCardPrice | MarketplaceDataFields.DonationPrice;
  label: string;
  fieldLabel: string;
  converter?: boolean;
  children?: (props: IDigitalProductTypeBudgeChildRendererProps) => ReactNode;
}

const DigitalProductTypeBudget = ({
  control,
  name,
  label,
  fieldLabel,
  converter = false,
  children,
}: IDigitalProductTypeBudgetProps): JSX.Element => {
  const productType = name === MarketplaceDataFields.GiftCardPrice ? ProductTypes.eGift : ProductTypes.donation;
  const checkboxName =
    name === MarketplaceDataFields.GiftCardPrice
      ? MarketplaceDataFields.IsGiftCardEnabled
      : MarketplaceDataFields.IsDonationEnabled;
  const checkboxControllerName = `${GiftingStepFields.MarketplaceData}.${checkboxName}` as const;
  const textFieldName = `${GiftingStepFields.MarketplaceData}.${name}` as const;

  const { countryIds } = useSelector(getDetailsData) || {};
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesMapByIds(countryIds || []), [countryIds]),
  );
  const nonUsdCurrencies = useMemo(
    () =>
      Object.values(countries).reduce(
        (currencies, country) =>
          country.currency.id === Currencies.constants.USD_ID ? currencies : [...currencies, country.currency.id],
        [] as number[],
      ),
    [countries],
  );
  const isConverterEnabled = converter && !!nonUsdCurrencies.length;

  const { teamId } = useSelector(getDetailsData) || {};
  const { useRestrictedIds, useEntities, isFulfilled } = useTeamProductTypes({ teamId, fetch: false });
  const restrictedTypeIds = useRestrictedIds();
  const productTypeEntities = useEntities();
  const availableCountryCodes = useMemo<string[] | undefined>(
    () => productTypeEntities[productType]?.countryIds?.map(countryId => countries[countryId]?.code).filter(Boolean),
    [productTypeEntities, countries, productType],
  );

  const isRestricted = useMemo(() => restrictedTypeIds.includes(productType), [productType, restrictedTypeIds]);
  const isAvailable = !!availableCountryCodes?.length;

  const { field: checkboxField } = useController({ control, name: checkboxControllerName });
  const {
    field: priceField,
    fieldState: { error: priceFieldError },
  } = useController({ control, name: textFieldName });
  const {
    field: restrictedTypeField,
    fieldState: { error: restrictedTypeError },
  } = useController({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.RestrictedTypeIds}` as const,
  });

  const handleCheckboxChange = (_: unknown, isChecked: boolean) => {
    checkboxField.onChange(isChecked);
    checkboxField.onBlur();
    if (isChecked) {
      restrictedTypeField.onChange(without([productType], restrictedTypeField.value));
    } else {
      restrictedTypeField.onChange([...restrictedTypeField.value, productType]);
    }
  };

  const { value: checkboxFieldValue, onChange: onCheckboxFieldChange } = checkboxField;
  const { onChange: onPriceChange } = priceField;
  useEffect(() => {
    if (!checkboxFieldValue) {
      onPriceChange(null);
    }
  }, [checkboxFieldValue, onPriceChange]);

  const isShouldBeUnchecked = (isRestricted || !isAvailable) && checkboxFieldValue && isFulfilled;
  useEffect(() => {
    if (isShouldBeUnchecked) {
      onCheckboxFieldChange(false);
    }
  }, [isShouldBeUnchecked, onCheckboxFieldChange]);

  return (
    <>
      <Grid container flexDirection="row" justifyContent="space-between">
        <Grid item display="flex">
          <FormControl error={!!restrictedTypeError?.message}>
            <FormControlLabel
              disabled={isRestricted || !isAvailable || !isFulfilled}
              control={
                <Tooltip
                  arrow
                  placement="top-start"
                  open={isRestricted || !isAvailable ? undefined : false}
                  title={
                    isRestricted
                      ? 'This type restricted on your team-level settings'
                      : 'The gift type is not available for your selected countries yet. Check back soon.'
                  }
                >
                  <div>
                    <Checkbox
                      disabled={isRestricted || !isAvailable || !isFulfilled}
                      onChange={handleCheckboxChange}
                      checked={checkboxField.value && !isRestricted}
                      icon={isRestricted ? <Icon width={24} icon="lock" /> : undefined}
                      color="primary"
                    />
                  </div>
                </Tooltip>
              }
              label={<CampaignSettings.StyledFormLabel>{label}</CampaignSettings.StyledFormLabel>}
            />
          </FormControl>
          <Box maxWidth={135} ml={7.5}>
            <ReactNumberFormat
              disabled={!checkboxField.value}
              decimalScale={0}
              allowNegative={false}
              customInput={TextField}
              prefix="$"
              placeholder="$"
              InputLabelProps={{ shrink: true }}
              error={!!priceFieldError?.message}
              helperText={priceFieldError?.message}
              label={`${fieldLabel}${checkboxField.value ? ' *' : ''}`}
              variant="outlined"
              margin="normal"
              value={priceField.value === null ? '' : priceField.value}
              onValueChange={({ floatValue }) => {
                priceField.onChange(typeof floatValue === 'undefined' ? null : floatValue);
              }}
              inputProps={{
                min: 0,
                'data-testid': `GiftingData.MarketplaceSettings.${name}Field`,
              }}
              onBlur={priceField.onBlur}
              fullWidth
            />
          </Box>
        </Grid>
        <Grid item xs={3} mt={1.5}>
          <Box fontSize="0.875rem">{availableCountryCodes?.join(', ')}</Box>
        </Grid>
      </Grid>
      <Collapse in={isConverterEnabled && priceField.value !== null} mountOnEnter unmountOnExit>
        <Box mt={1}>
          <CurrencyConverter.Component
            price={priceField.value ?? 0}
            fromCurrencyId={Currencies.constants.USD_ID}
            toCurrencyIds={nonUsdCurrencies}
          />
        </Box>
      </Collapse>
      {children && children({ enabled: checkboxFieldValue, value: priceField.value })}
    </>
  );
};

export default memo(DigitalProductTypeBudget);
