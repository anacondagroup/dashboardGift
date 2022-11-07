import React, { memo, ReactElement, useCallback, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useExternalErrors, useModalState, useScrollTop } from '@alycecom/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pick } from 'ramda';
import { TrackEvent } from '@alycecom/services';
import { User } from '@alycecom/modules';
import { TotalCount } from '@alycecom/ui';

import { resetProductsState, setPage, updateFilters } from '../store/products/products.actions';
import { ProductFilter, IProductsFilters } from '../store/products/products.types';
import { useGetSenderMarketplaceGeneralPayload, useTrackSenderMarketplace } from '../hooks/useTrackSenderMarketplace';
import { useProductDetails } from '../hooks/useProductDetails';
import { useCampaignMarketplace } from '../hooks/useCampaignMarketplace';
import { useResetToCampaignValues } from '../hooks/useResetCampaignMarketplace';
import { getErrors } from '../store/campaignSettings/campaignSettings.selectors';
import { fetchCampaignSettings, resetCampaignSettings } from '../store/campaignSettings/campaignSettings.actions';
import { campaignSettingsFormSchema } from '../store/campaignSettings/campaignSettings.schemas';
import { TCampaignMarketplaceForm } from '../store/campaignSettings/campaignSettings.types';
import { useSyncFiltersWithForm } from '../hooks/useSyncFiltersWithForm';
import { getPagination, getFilters } from '../store/products/products.selectors';
import { useTrackCustomMarketplaceCreateClicked } from '../hooks/useTrackCustomMarketplace';

import MarketplaceFilter from './MarketplaceFilter/MarketplaceFilter';
import ScrollTopButton from './ScrollTopButton/ScrollTopButton';
import ProductDetails from './ProductDetails/ProductDetails';
import Marketplace from './Marketplace/Marketplace';
import MarketplaceHeader from './MarketplaceHeader/MarketplaceHeader';
import { CustomMarketplaceSidebar } from './CustomMarketplaceSidebar';
import { CampaignGiftFilters } from './CampaignGiftFilters';

const createFormResolver = (): [Resolver<TCampaignMarketplaceForm>, TCampaignMarketplaceForm] => {
  const schema = campaignSettingsFormSchema;

  return [yupResolver(schema), schema.getDefault() as TCampaignMarketplaceForm];
};

const CampaignMarketplace = (): ReactElement => {
  const dispatch = useDispatch();
  const { trackEvent } = TrackEvent.useTrackEvent();
  const { campaignId } = useCampaignMarketplace();
  const externalErrors = useSelector(getErrors);
  const { total } = useSelector(getPagination);
  const currentFilters = useSelector(getFilters);

  const [resolver, defaultValues] = useMemo(() => createFormResolver(), []);
  const methods = useForm<TCampaignMarketplaceForm>({
    mode: 'all',
    defaultValues,
    resolver,
  });
  const { reset, setError } = methods;

  // @ts-ignore
  useExternalErrors(setError, externalErrors);
  const resetToCampaignValues = useResetToCampaignValues(reset);
  const { product, handleOpenDetails, handleCloseDetails } = useProductDetails();
  const { isOpen: isSidebarOpen, handleOpen: handleSidebarOpen, handleClose: handleSidebarClose } = useModalState();

  const trackCustomMarketplaceCreateClicked = useTrackCustomMarketplaceCreateClicked();

  const handleCreateMarketplaceClicked = useCallback(() => {
    handleSidebarOpen();
    trackCustomMarketplaceCreateClicked();
  }, [handleSidebarOpen, trackCustomMarketplaceCreateClicked]);

  const resetToDefaultValues = useCallback(() => {
    dispatch(updateFilters(defaultValues));
    reset(defaultValues);
  }, [dispatch, defaultValues, reset]);

  const handleClearFilters = useCallback(() => {
    if (campaignId) {
      resetToCampaignValues();
    } else {
      resetToDefaultValues();
    }
  }, [campaignId, resetToDefaultValues, resetToCampaignValues]);

  useSyncFiltersWithForm(reset);
  useTrackSenderMarketplace('Sender Marketplace - visited');
  useScrollTop();
  useEffect(
    () => () => {
      dispatch(resetProductsState());
      dispatch(resetCampaignSettings());
    },
    [dispatch],
  );
  useEffect(() => {
    if (Number(campaignId)) {
      dispatch(fetchCampaignSettings(Number(campaignId)));
    }
  }, [dispatch, campaignId]);
  useEffect(() => {
    dispatch(setPage(1));
  }, [dispatch]);

  const generalPayload = useGetSenderMarketplaceGeneralPayload();
  const handleUpdateFilters = useCallback(
    (filters: TCampaignMarketplaceForm) => {
      const finalFilters = {
        [ProductFilter.MinPrice]: undefined,
        [ProductFilter.MaxPrice]: undefined,
        [ProductFilter.DonationPrice]: undefined,
        [ProductFilter.GiftCardPrice]: undefined,
        ...filters,
      };
      dispatch(updateFilters(finalFilters));

      const budget = pick(
        [ProductFilter.MinPrice, ProductFilter.MaxPrice, ProductFilter.DonationPrice, ProductFilter.GiftCardPrice],
        finalFilters,
      );

      trackEvent('Sender Marketplace - Filters applied', {
        ...generalPayload,
        filters: {
          ...budget,
          types: filters[ProductFilter.TypeIds].join(','),
          brands: filters[ProductFilter.BrandIds].join(','),
          merchants: filters[ProductFilter.MerchantIds].join(','),
        },
      });
    },
    [dispatch, trackEvent, generalPayload],
  );
  const warningMessage = useSelector(User.selectors.getHasDisableMargin)
    ? '* Final cost of gifts may vary depending on the price of items at time of purchase'
    : '';

  const sendForm = useCallback(
    (filters: IProductsFilters) => {
      const filtersToApply = {
        ...currentFilters,
        ...filters,
      };
      handleUpdateFilters(filtersToApply);
    },
    [currentFilters, handleUpdateFilters],
  );

  return (
    <>
      <Box display="flex" flexDirection="column">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleUpdateFilters)}>
            <MarketplaceHeader onCreateMarketplaceClick={handleCreateMarketplaceClicked} />
            <Box bgcolor="common.white">
              <CampaignGiftFilters onReset={handleClearFilters} submitForm={sendForm} />
              <MarketplaceFilter />
              <Box maxWidth={1240} mx="auto" pl={1}>
                <TotalCount total={total} />
              </Box>
              <Box maxWidth={1240} mx="auto" pl={1} style={{ fontStyle: 'italic' }}>
                {warningMessage}
              </Box>
              <Marketplace onViewProductDetails={handleOpenDetails} />
            </Box>
          </form>
        </FormProvider>
      </Box>
      <ProductDetails isOpen={!!product} product={product} onClose={handleCloseDetails} />
      <CustomMarketplaceSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <ScrollTopButton />
    </>
  );
};

export default memo(CampaignMarketplace);
