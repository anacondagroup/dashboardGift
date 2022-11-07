import React, { useCallback, useEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollTop } from '@alycecom/hooks';
import { IProduct, TotalCount } from '@alycecom/ui';
import { useHistory } from 'react-router-dom';

import { useCustomMarketplace } from '../hooks/useCustomMarketplace';
import {
  addCustomMarketplaceProduct,
  fetchCustomMarketplaceById,
  removeCustomMarketplaceProduct,
  resetCustomMarketplace,
} from '../store/customMarketplace/customMarketplace.actions';
import { useProductDetails } from '../hooks/useProductDetails';
import { resetProductsState, setPage } from '../store/products/products.actions';
import {
  getDisabledGiftFilters,
  getIsRejected,
  getIsUserCanEditMarketplace,
  getMarketplaceId,
  getSetOfAddedProductIds,
  getSetOfPendingProductIds,
} from '../store/customMarketplace/customMarketplace.selectors';
import { getPagination } from '../store/products/products.selectors';
import { MARKETPLACE_ROUTES } from '../routePaths';
import {
  useTrackCustomMarketplaceExportResults,
  useTrackCustomMarketplaceProductAdded,
  useTrackCustomMarketplaceProductDetailsViewed,
} from '../hooks/useTrackCustomMarketplace';

import ProductDetails from './ProductDetails/ProductDetails';
import Marketplace from './Marketplace/Marketplace';
import { CustomMarketplaceHeader } from './CustomMarketplaceHeader';
import MarketplaceFilter from './MarketplaceFilter/MarketplaceFilter';
import CustomMarketplaceGiftFilters from './CustomMarketplaceGiftFilters/CustomMarketplaceGiftFilters';
import CustomMarketplaceFooter from './CustomMarketplaceFooter/CustomMarketplaceFooter';
import AddAllButton from './AddAllButton/AddAllButton';
import RemoveAllButton from './RemoveAllButton/RemoveAllButton';

const CustomMarketplace = (): JSX.Element => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const disabledFilters = useSelector(getDisabledGiftFilters);
  const setOfAddedProductIds = useSelector(getSetOfAddedProductIds);
  const setOfPendingProductIds = useSelector(getSetOfPendingProductIds);
  const isRejected = useSelector(getIsRejected);
  const storedMarketplaceId = useSelector(getMarketplaceId);
  const isCanEditMarketplace = useSelector(getIsUserCanEditMarketplace);
  const { total } = useSelector(getPagination);
  const { product, handleOpenDetails, handleCloseDetails } = useProductDetails();
  const { marketplaceId, isEdit, mode } = useCustomMarketplace();

  const getIsProductIdAdded = useCallback(id => setOfAddedProductIds.has(id), [setOfAddedProductIds]);
  const getIsProductIdPending = useCallback(id => setOfPendingProductIds.has(id), [setOfPendingProductIds]);

  const isDetailedProductAdded = !!product && getIsProductIdAdded(product.id);
  const isCanAddFromProductDetails = isCanEditMarketplace && isEdit && (!product || !isDetailedProductAdded);
  const isCanRemoveFromProductDetails = isCanEditMarketplace && isEdit && !!product && isDetailedProductAdded;
  const isBulkBtnVisible = isCanEditMarketplace && isEdit;

  const trackProductAdded = useTrackCustomMarketplaceProductAdded();
  const trackProductDetailsViewed = useTrackCustomMarketplaceProductDetailsViewed();
  const trackExportResults = useTrackCustomMarketplaceExportResults();

  useEffect(
    () => () => {
      dispatch(resetCustomMarketplace());
      dispatch(resetProductsState());
    },
    [dispatch],
  );

  useEffect(() => {
    if (marketplaceId) {
      dispatch(fetchCustomMarketplaceById(marketplaceId));
    }
  }, [dispatch, marketplaceId]);

  useEffect(() => {
    if (!storedMarketplaceId && isRejected) {
      push(MARKETPLACE_ROUTES.SHARED_PATH);
    }
  }, [push, isRejected, storedMarketplaceId]);

  useEffect(() => {
    dispatch(setPage(1));
  }, [dispatch]);

  useScrollTop();

  const handleAddProduct = useCallback(
    (productId: number) => {
      dispatch(addCustomMarketplaceProduct({ productId }));
    },
    [dispatch],
  );

  const handleAddProductFromDetails = useCallback(
    (productId: number) => {
      handleAddProduct(productId);
      trackProductAdded('preview', productId);
    },
    [trackProductAdded, handleAddProduct],
  );

  const handleAddProductFromGrid = useCallback(
    (productId: number) => {
      handleAddProduct(productId);
      trackProductAdded('single', productId);
    },
    [trackProductAdded, handleAddProduct],
  );

  const handleOpenProductDetailsWithEvent = useCallback(
    (productItem: IProduct) => {
      handleOpenDetails(productItem);
      trackProductDetailsViewed(productItem.id);
    },
    [handleOpenDetails, trackProductDetailsViewed],
  );

  const onExport = useCallback(() => {
    trackExportResults(mode);
  }, [trackExportResults, mode]);

  const handleRemoveProduct = useCallback(
    (productId: number) => {
      dispatch(removeCustomMarketplaceProduct({ productId }));
    },
    [dispatch],
  );

  return (
    <>
      <Box display="flex" flexDirection="column">
        <CustomMarketplaceHeader />
        <Box bgcolor="common.white">
          <CustomMarketplaceGiftFilters />
          <MarketplaceFilter disabledFilters={disabledFilters} canExport={!isEdit} onExport={onExport} />
          <Box maxWidth={1240} display="flex" alignItems="center" mx="auto" px={1}>
            <TotalCount total={total} width={125} ml={3} />
            <Fade in={isBulkBtnVisible} unmountOnExit mountOnEnter>
              <Box>
                <AddAllButton />
                <RemoveAllButton />
              </Box>
            </Fade>
          </Box>
          <Marketplace
            onAddProduct={isEdit && isCanEditMarketplace && handleAddProductFromGrid}
            onRemoveProduct={isEdit && isCanEditMarketplace && handleRemoveProduct}
            getIsProductIdAdded={getIsProductIdAdded}
            getIsProductIdPending={getIsProductIdPending}
            onViewProductDetails={handleOpenProductDetailsWithEvent}
          />
        </Box>
        <CustomMarketplaceFooter />
      </Box>
      <ProductDetails
        onAddProduct={isCanAddFromProductDetails && handleAddProductFromDetails}
        onRemoveProduct={isCanRemoveFromProductDetails && handleRemoveProduct}
        isOpen={!!product}
        product={product}
        onClose={handleCloseDetails}
        disabled={!!product && getIsProductIdPending(product.id)}
      />
    </>
  );
};

export default CustomMarketplace;
