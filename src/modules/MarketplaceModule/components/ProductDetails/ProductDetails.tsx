import React, { useMemo, useState, useEffect, useCallback, ReactElement, memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlyceLoading,
  Product,
  Merchant,
  MerchantHeader,
  ProductSidebar,
  ProductSidebarHeader,
  ProductSidebarTitle,
  ProductDetailsWrapper,
  IProduct,
} from '@alycecom/ui';
import { TrackEvent } from '@alycecom/services';

import { getIsLoading, getProduct } from '../../store/productDetails/productDetails.selectors';
import { loadProductDetailsRequest, resetProductDetails } from '../../store/productDetails/productDetails.actions';
import { useGetSenderMarketplaceGeneralPayload } from '../../hooks/useTrackSenderMarketplace';

export interface IProductDetailsSidebarProps {
  isOpen: boolean;
  product?: IProduct;
  onClose: () => void;
  onAddProduct?: false | ((productId: number) => void);
  onRemoveProduct?: false | ((productId: number) => void);
  disabled?: boolean;
}

const ProductDetails = ({
  isOpen,
  product,
  onClose,
  onAddProduct,
  onRemoveProduct,
  disabled,
}: IProductDetailsSidebarProps): ReactElement => {
  const dispatch = useDispatch();
  const [isMerchantSidebar, setIsMerchantSidebar] = useState(false);

  const isLoading = useSelector(getIsLoading);
  const productDetails = useSelector(getProduct);
  const { trackEvent } = TrackEvent.useTrackEvent();
  const generalPayload = useGetSenderMarketplaceGeneralPayload();

  const handleToggleMerchant = useCallback(() => {
    setIsMerchantSidebar(isMerchantView => !isMerchantView);
  }, []);

  const productDetailsHeader = useMemo(() => {
    if (!productDetails) {
      return <></>;
    }
    const headerComponent = isMerchantSidebar ? (
      <MerchantHeader title="Merchant details" logo={productDetails?.provider.logo} onBack={handleToggleMerchant} />
    ) : (
      <ProductSidebarTitle title="Product details" />
    );
    return <ProductSidebarHeader onClose={onClose}>{headerComponent}</ProductSidebarHeader>;
  }, [handleToggleMerchant, productDetails, isMerchantSidebar, onClose]);

  const detailsOpened = useRef(false);
  useEffect(() => {
    if (isOpen && product) {
      dispatch(loadProductDetailsRequest({ productId: product.id, localPrice: product.denomination }));
    } else {
      dispatch(resetProductDetails());
      setIsMerchantSidebar(false);
      detailsOpened.current = false;
    }
  }, [isOpen, product, dispatch, detailsOpened]);

  useEffect(() => {
    const { current: isMounted } = detailsOpened;
    if (isOpen && product && !isMounted) {
      trackEvent('Marketplace product — opened details', { ...generalPayload, productId: product.id });
      detailsOpened.current = true;
    }
  }, [isOpen, product, generalPayload, trackEvent, detailsOpened]);

  return (
    <ProductSidebar isOpen={isOpen} onClose={onClose} header={productDetailsHeader}>
      <AlyceLoading isLoading={isLoading} boxProps={{ mt: 6 }}>
        <ProductDetailsWrapper hasProduct={!!productDetails}>
          {isMerchantSidebar ? (
            <Merchant product={productDetails} />
          ) : (
            <Product
              product={productDetails}
              onAddProduct={onAddProduct}
              onRemoveProduct={onRemoveProduct}
              onShowMerchant={handleToggleMerchant}
              disabled={disabled}
            />
          )}
        </ProductDetailsWrapper>
      </AlyceLoading>
    </ProductSidebar>
  );
};

export default memo(ProductDetails);
