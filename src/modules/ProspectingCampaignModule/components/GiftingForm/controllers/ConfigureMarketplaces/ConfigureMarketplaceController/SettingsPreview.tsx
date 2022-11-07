import React, { useMemo, memo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Box, BoxProps, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { NumberFormat } from '@alycecom/ui';
import { Link } from 'react-router-dom';
import { ProductsCount, CampaignSettings } from '@alycecom/modules';
import qs from 'query-string';

import { useTeamProductTypes } from '../../../../../../MarketplaceModule/hooks/useTeamProductTypes';
import { getDetailsData } from '../../../../../store/prospectingCampaign/steps/details/details.selectors';
import { useFormValuesAsMarketplaceFilters } from '../../../hooks/useFormValuesAsMarketplaceFilters';
import { MARKETPLACE_ROUTES } from '../../../../../../MarketplaceModule/routePaths';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export interface ISettingsPreviewProps extends BoxProps {
  control: Control<TProspectingGiftingForm>;
}

const SettingsPreview = ({ control, ...rootProps }: ISettingsPreviewProps): JSX.Element => {
  const { teamId } = useSelector(getDetailsData) || {};
  const marketplaceData = useWatch({
    control,
    name: GiftingStepFields.MarketplaceData,
  });
  const {
    [MarketplaceDataFields.RestrictedTypeIds]: restrictedProductTypeIds,
    [MarketplaceDataFields.MinPrice]: minPrice,
    [MarketplaceDataFields.MaxPrice]: maxPrice,
    [MarketplaceDataFields.GiftCardPrice]: giftCardPrice,
    [MarketplaceDataFields.DonationPrice]: donationPrice,
    [MarketplaceDataFields.RestrictedBrandIds]: restrictedBrandIds,
    [MarketplaceDataFields.RestrictedMerchantIds]: restrictedMerchantIds,
  } = marketplaceData || {};
  const [isFiltersReady, filters] = useFormValuesAsMarketplaceFilters(marketplaceData);
  const filterQueryParams = useMemo(
    () =>
      qs.stringify(filters, {
        arrayFormat: 'comma',
        skipNull: true,
        skipEmptyString: true,
      }),
    [filters],
  );
  const { isPending: isProductsCountPending, count } = ProductsCount.hooks.useProductsCount({
    filters,
    fetch: isFiltersReady,
  });

  const { useAll, useRestrictedIds } = useTeamProductTypes({ teamId, fetch: false });
  const productTypes = useAll();
  const restrictedTeamProductTypeIds = useRestrictedIds();

  const productTypesString = useMemo(
    () =>
      productTypes.reduce((acc, productType) => {
        if (
          restrictedProductTypeIds?.includes(productType.id) ||
          restrictedTeamProductTypeIds?.includes(productType.id)
        ) {
          return acc;
        }

        return `${acc}${acc.length === 0 ? '' : ', '}${productType.label}`;
      }, ''),
    [productTypes, restrictedProductTypeIds, restrictedTeamProductTypeIds],
  );

  const hasPhysicalBudget = typeof minPrice === 'number' && typeof maxPrice === 'number';
  const hasGiftCardPrice = typeof giftCardPrice === 'number';
  const hasDonationPrice = typeof donationPrice === 'number';

  const restrictedVendorsAmount = (restrictedBrandIds?.length ?? 0) + (restrictedMerchantIds?.length ?? 0);

  return (
    <Box bgcolor="common.white" border="1px solid" borderColor="text.primary" p={2} {...rootProps}>
      <Box fontWeight={700} fontSize="1.125rem" color="grey.main" mb={2}>
        Marketplace Details
      </Box>
      <Grid container direction="column" spacing={4}>
        <Grid item container spacing={5} direction="row">
          <Grid item>
            <CampaignSettings.StyledFormLabel>Gift Types</CampaignSettings.StyledFormLabel>
          </Grid>
          <Grid item>{productTypesString}</Grid>
        </Grid>
        {(hasPhysicalBudget || hasGiftCardPrice || hasDonationPrice) && (
          <Grid item container direction="row" spacing={10}>
            {hasPhysicalBudget && (
              <Grid item>
                <CampaignSettings.StyledFormLabel>Gift Budget</CampaignSettings.StyledFormLabel>
                <Box>
                  <NumberFormat format="$0,0">{minPrice}</NumberFormat>-
                  <NumberFormat format="$0,0">{maxPrice}</NumberFormat>
                </Box>
              </Grid>
            )}
            {hasGiftCardPrice && (
              <Grid item>
                <CampaignSettings.StyledFormLabel>Gift Card Amount</CampaignSettings.StyledFormLabel>
                <Box>
                  Max <NumberFormat format="$0,0">{giftCardPrice}</NumberFormat>
                </Box>
              </Grid>
            )}
            {hasDonationPrice && (
              <Grid item>
                <CampaignSettings.StyledFormLabel>Donation Amount</CampaignSettings.StyledFormLabel>
                <Box>
                  <NumberFormat format="$0,0">{donationPrice}</NumberFormat>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
        <Grid item container spacing={5} direction="row">
          <Grid item>
            <CampaignSettings.StyledFormLabel>Vendors</CampaignSettings.StyledFormLabel>
          </Grid>
          <Grid item>{restrictedVendorsAmount || 'No'} restricted vendors</Grid>
        </Grid>
        {isFiltersReady && (
          <Grid item>
            {!isProductsCountPending && (
              <Box fontWeight={700} display="inline">
                {count} Gifts |{' '}
              </Box>
            )}
            <Link target="_blank" to={`${MARKETPLACE_ROUTES.buildCampaignPath()}?${filterQueryParams}`}>
              Preview Marketplace
            </Link>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default memo(SettingsPreview);
