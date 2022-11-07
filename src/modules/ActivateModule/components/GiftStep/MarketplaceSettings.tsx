import React, { memo, useEffect, useMemo } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Divider, NumberFormat } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { IExchangeMarketplaceSettings } from '../../store';
import { getActivateModuleParams, getMarketplaceGiftTypeNames } from '../../store/activate.selectors';
import {
  getAvailableBrandsIds,
  getAvailableMerchantsIds,
  getAvailableTypesIds,
  getExchangeMarketplaceSettings,
  getRestrictedVendorsAmount,
} from '../../store/steps/gift';
import { MARKETPLACE_ROUTES } from '../../../MarketplaceModule/routePaths';
import {
  getProductsCount,
  getIsFulfilled as getIsProductsCountFulfilled,
} from '../../store/productsCount/productsCount.selectors';
import { fetchProductsCount } from '../../store/productsCount/productsCount.actions';
import { ProductFilter } from '../../../MarketplaceModule/store/products/products.types';
import { getCountryIds } from '../../store/steps/details';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  root: {
    border: `1px solid ${palette.grey.chambray50}`,
    borderRadius: 5,
    width: 530,
  },
  previewLink: {
    fontWeight: 'normal',
  },
}));

export interface IMarketplaceSettingsProps {
  data: IExchangeMarketplaceSettings;
}

const MarketplaceSettings = ({ data }: IMarketplaceSettingsProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { campaignId, isEditorMode } = useSelector(getActivateModuleParams);
  const giftTypeNames = useSelector(getMarketplaceGiftTypeNames);
  const restrictedVendorsCount = useSelector(getRestrictedVendorsAmount);
  const productsCount = useSelector(getProductsCount);
  const isProductsCountFulfilled = useSelector(getIsProductsCountFulfilled);
  const availableMerchantIds = useSelector(getAvailableMerchantsIds);
  const availableBrandIds = useSelector(getAvailableBrandsIds);
  const availableTypeIds = useSelector(getAvailableTypesIds);
  const campaignCountries = useSelector(getCountryIds);
  const marketplaceSettings = useSelector(getExchangeMarketplaceSettings);

  const isBudgetHidden =
    (data.minBudgetAmount === null && data.maxBudgetAmount === null) ||
    (data.minBudgetAmount === 0 && data.maxBudgetAmount === 0);

  const giftMarketplaceLink = useMemo(() => {
    const filters = {
      [ProductFilter.DonationPrice]: marketplaceSettings?.donationMaxBudget,
      [ProductFilter.GiftCardPrice]: marketplaceSettings?.giftCardMaxBudget,
      [ProductFilter.MaxPrice]: marketplaceSettings?.maxBudgetAmount,
      [ProductFilter.MinPrice]: marketplaceSettings?.minBudgetAmount,
      [ProductFilter.BrandIds]: availableBrandIds,
      [ProductFilter.TypeIds]: availableTypeIds,
      [ProductFilter.MerchantIds]: availableMerchantIds,
      [ProductFilter.CountryIds]: campaignCountries,
    };
    return isEditorMode
      ? MARKETPLACE_ROUTES.buildCampaignPath(campaignId)
      : MARKETPLACE_ROUTES.buildMarketplacePathWithFilter(filters);
  }, [
    campaignId,
    isEditorMode,
    availableBrandIds,
    availableTypeIds,
    availableMerchantIds,
    campaignCountries,
    marketplaceSettings,
  ]);

  useEffect(() => {
    if (!isProductsCountFulfilled) {
      dispatch(fetchProductsCount());
    }
  }, [dispatch, isProductsCountFulfilled]);

  return (
    <Box p={2} className={classes.root}>
      <Box display="flex" justifyContent="space-between">
        <Box className="Body-Regular-Center-Chambray-Bold">Marketplace Details</Box>
        <Box display="flex">
          <Box display="flex" className="Body-Regular-Center-Chambray">
            {isProductsCountFulfilled ? productsCount : <Skeleton width={40} />}
            &nbsp;Gifts |&nbsp;
          </Box>
          <Box>
            <Link target="_blank" to={giftMarketplaceLink} className={classes.previewLink}>
              Preview Marketplace
            </Link>
          </Box>
        </Box>
      </Box>
      <Divider color="primary.main" mt={1.5} />
      <Box display="flex" mt={2.5}>
        <Box className="Body-Regular-Left-Chambray-Bold" whiteSpace="nowrap" mr={5}>
          Gift Types
        </Box>
        <Box className="Body-Regular-Left-Chambray">
          {giftTypeNames.length > 0 ? giftTypeNames.join(', ') : 'All gift types are restricted'}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" flex="1 0 auto" my={4} mr={2}>
          <Box className="Body-Regular-Center-Chambray-Bold">Gift Budget</Box>
          <Box className="Body-Regular-Center-Chambray" mt={1} data-testid="MarketplaceSettings.GiftBudget">
            {isBudgetHidden ? (
              <Box>-</Box>
            ) : (
              <>
                <NumberFormat format="$0,0">{data.minBudgetAmount}</NumberFormat> -{' '}
                <NumberFormat format="$0,0">{data.maxBudgetAmount}</NumberFormat>
              </>
            )}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" flex="1 0 auto" my={4}>
          <Box className="Body-Regular-Center-Chambray-Bold">Gift Card Price</Box>
          <Box className="Body-Regular-Center-Chambray" mt={1} data-testid="MarketplaceSettings.GiftCardBudget">
            {data.giftCardMaxBudget === null || data.giftCardMaxBudget === 0 ? (
              <Box>-</Box>
            ) : (
              <NumberFormat format="$0,0">{data.giftCardMaxBudget}</NumberFormat>
            )}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" flex="1 0 auto" my={4}>
          <Box className="Body-Regular-Center-Chambray-Bold">Donation amount</Box>
          <Box className="Body-Regular-Center-Chambray" mt={1} data-testid="MarketplaceSettings.DonationBudget">
            {data.donationMaxBudget === null || data.donationMaxBudget === 0 ? (
              <Box>-</Box>
            ) : (
              <NumberFormat format="$0,0">{data.donationMaxBudget}</NumberFormat>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex">
        <Box className="Body-Regular-Center-Chambray-Bold" mr={6}>
          Vendors
        </Box>
        <Typography className="Body-Regular-Center-Chambray">
          {restrictedVendorsCount ? `Restricted ${restrictedVendorsCount} vendors` : 'No restricted vendors'}
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(MarketplaceSettings);
