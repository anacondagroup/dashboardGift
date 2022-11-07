import React, { useCallback, memo, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Divider, Icon } from '@alycecom/ui';
import { Box, Button, Zoom, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { useFormContext } from 'react-hook-form';

import { ProductFilter, IProductsFilters } from '../../store/products/products.types';
import { fetchProductTypes } from '../../store/entities/productTypes/productTypes.actions';
import { fetchProductVendors } from '../../store/entities/productVendors/productVendors.actions';
import { FilterItem, FilterLayout } from '../FiltersLayout';
import { useCampaignMarketplace } from '../../hooks/useCampaignMarketplace';
import { getCustomMarketplaceTeamIds } from '../../store/customMarketplace/customMarketplace.selectors';
import { usePriceAvailability } from '../../hooks/usePriceAvailability';

import TypeIds from './fields/TypeIds';
import MinPrice from './fields/MinPrice';
import MaxPrice from './fields/MaxPrice';
import GiftCardPrice from './fields/GiftCardPrice';
import DonationPrice from './fields/DonationPrice';
import Vendors from './fields/Vendors';

export interface IRestrictionFiltersProps {
  disabledFilters?: ProductFilter[];
  hiddenFilters?: ProductFilter[];
  loading?: boolean;
  hasChanges?: boolean;
  onReset: () => void;
  tooltipText?: React.ReactNode;
  restrictedTypeIds?: EntityId[];
  restrictedVendorIds?: EntityId[];
  submitForm?: (filters: IProductsFilters) => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  button: {
    color: palette.link.main,
  },
  tooltip: {
    width: 300,
    backgroundColor: palette.common.white,
    fontSize: 16,
    fontWeight: 400,
    color: palette.text.primary,
    border: `1px solid ${palette.border.grey}`,
    padding: spacing(2),
  },
}));

const RestrictionFilters = ({
  disabledFilters = [],
  hiddenFilters = [],
  loading = false,
  hasChanges = false,
  tooltipText = undefined,
  onReset,
  restrictedTypeIds = [],
  restrictedVendorIds = [],
  submitForm,
}: IRestrictionFiltersProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { campaignId } = useCampaignMarketplace();
  const teamIds = useSelector(getCustomMarketplaceTeamIds);

  const shouldRestrictPricesFields = Boolean(campaignId);
  const { isDigitalAvailable, isDonationAvailable, isPhysicalAvailable } = usePriceAvailability(Number(campaignId));
  const showMinPrice =
    !hiddenFilters.includes(ProductFilter.MinPrice) && (!shouldRestrictPricesFields || isPhysicalAvailable);
  const showMaxPrice =
    !hiddenFilters.includes(ProductFilter.MaxPrice) && (!shouldRestrictPricesFields || isPhysicalAvailable);
  const showGiftCardPrice =
    !hiddenFilters.includes(ProductFilter.GiftCardPrice) && (!shouldRestrictPricesFields || isDigitalAvailable);
  const showDonationPrice =
    !hiddenFilters.includes(ProductFilter.DonationPrice) && (!shouldRestrictPricesFields || isDonationAvailable);

  const {
    control,
    formState: { dirtyFields, errors },
  } = useFormContext();
  const isDirty = Object.keys(dirtyFields).length > 0;

  const isClearBtnDisabled = !isDirty && !hasChanges;

  const getTypeDisabled = useCallback((entityId: EntityId) => restrictedTypeIds.includes(entityId), [
    restrictedTypeIds,
  ]);
  const getVendorDisabled = useCallback(vendor => restrictedVendorIds.includes(`${vendor.type}/${vendor.id}`), [
    restrictedVendorIds,
  ]);
  const isFilterDisabled = (filter: ProductFilter) => loading || disabledFilters.includes(filter);

  useEffect(() => {
    dispatch(fetchProductVendors({ campaignId: Number(campaignId) || undefined, teamIds: teamIds || undefined }));
  }, [dispatch, campaignId, teamIds]);

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, [dispatch]);

  return (
    <FilterLayout
      pt={4}
      afterFilters={<Divider mt={2} />}
      title={
        <>
          <Typography className="Body-Regular-Center-Chambray-Bold">Gift Filter</Typography>
          {tooltipText && (
            <Tooltip classes={{ tooltip: classes.tooltip }} title={tooltipText} placement="top-start">
              <Box ml={1}>
                <Icon data-testid="Tooltip.Icon" color="grey.main" icon="exclamation-circle" />
              </Box>
            </Tooltip>
          )}
        </>
      }
      actions={
        <>
          <Button
            data-testid="CampaignFilter.CancelButton"
            className={classes.button}
            disabled={isClearBtnDisabled}
            onClick={onReset}
            variant="outlined"
          >
            Clear Gift Filters
          </Button>
        </>
      }
    >
      <>
        <FilterItem size="medium">
          <TypeIds
            control={control}
            getIsDisabled={getTypeDisabled}
            disabled={isFilterDisabled(ProductFilter.TypeIds)}
            submitForm={submitForm}
          />
        </FilterItem>
        <Zoom in={showMinPrice} mountOnEnter unmountOnExit>
          <FilterItem size="small">
            <MinPrice
              control={control}
              error={errors[ProductFilter.MinPrice]?.message}
              disabled={isFilterDisabled(ProductFilter.MinPrice)}
              submitForm={submitForm}
            />
          </FilterItem>
        </Zoom>
        <Zoom in={showMaxPrice} mountOnEnter unmountOnExit>
          <FilterItem size="small">
            <MaxPrice
              control={control}
              error={errors[ProductFilter.MaxPrice]?.message}
              disabled={isFilterDisabled(ProductFilter.MaxPrice)}
              submitForm={submitForm}
            />
          </FilterItem>
        </Zoom>
        <Zoom in={showGiftCardPrice} mountOnEnter unmountOnExit>
          <FilterItem size="small">
            <GiftCardPrice
              control={control}
              error={errors[ProductFilter.GiftCardPrice]?.message}
              disabled={isFilterDisabled(ProductFilter.GiftCardPrice)}
              submitForm={submitForm}
            />
          </FilterItem>
        </Zoom>
        <Zoom in={showDonationPrice} mountOnEnter unmountOnExit>
          <FilterItem size="small">
            <DonationPrice
              control={control}
              error={errors[ProductFilter.DonationPrice]?.message}
              disabled={isFilterDisabled(ProductFilter.DonationPrice)}
              submitForm={submitForm}
            />
          </FilterItem>
        </Zoom>
        <FilterItem size="medium">
          <Vendors
            control={control}
            disabled={isFilterDisabled(ProductFilter.Vendors)}
            getIsDisabled={getVendorDisabled}
            submitForm={submitForm}
          />
        </FilterItem>
      </>
    </FilterLayout>
  );
};

export default memo(RestrictionFilters);
