import React, { useCallback, memo } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { SharedMarketplace, MarketplaceSpinner, IProduct, MarketplaceEmptySearch } from '@alycecom/ui';

import {
  getIsLoading,
  getProducts,
  getHasMore,
  getPagination,
  getHasSelectedFilters,
  getSearch,
} from '../../store/products/products.selectors';
import { setPage } from '../../store/products/products.actions';
import spinner from '../../assets/spinner.svg';
import notFoundProduct from '../../../../assets/images/not-found-product.svg';

import MarketplaceItem from './MarketplaceItem';

export interface IMarketplaceProps {
  onViewProductDetails: (productId: IProduct) => void;
  onAddProduct?: false | ((productId: number) => void);
  onRemoveProduct?: false | ((productId: number) => void);
  getIsProductIdAdded?: (productId: number) => boolean;
  getIsProductIdPending?: (productId: number) => boolean;
}

const Marketplace = ({
  onViewProductDetails,
  onAddProduct,
  onRemoveProduct,
  getIsProductIdAdded,
  getIsProductIdPending,
}: IMarketplaceProps): JSX.Element => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoading);
  const products = useSelector(getProducts);
  const hasMore = useSelector(getHasMore);
  const pagination = useSelector(getPagination);
  const hasFilters = useSelector(getHasSelectedFilters);
  const search = useSelector(getSearch);

  const loadNextPage = useCallback(() => {
    if (!isLoading && hasMore) {
      const page = pagination.currentPage + 1;
      dispatch(setPage(page));
    }
  }, [isLoading, pagination, hasMore, dispatch]);

  const renderItem = (productItem: IProduct, index: number) => {
    const { id } = productItem;
    const isAdded = getIsProductIdAdded?.(id);
    const isDisabled = getIsProductIdPending?.(id);

    return (
      <MarketplaceItem
        key={id}
        product={productItem}
        transitionDelay={`${(index % 20) * 75}ms`}
        onDetails={onViewProductDetails}
        onAdd={onAddProduct}
        onRemove={onRemoveProduct}
        disabled={isDisabled}
        isAdded={isAdded}
      />
    );
  };

  const renderEmpty = useCallback(
    () => (
      <MarketplaceEmptySearch
        image={notFoundProduct}
        hasFilters={hasFilters}
        search={search}
        justifyContent="flex-start"
      />
    ),
    [hasFilters, search],
  );

  return (
    <>
      <Box display="flex" flex="1 1 0px" p={4} justifyContent="center" minHeight="calc(100vh - 400px)">
        <SharedMarketplace
          isLoading={isLoading}
          products={products}
          loadNextPage={loadNextPage}
          loader={<MarketplaceSpinner image={spinner} key={0} />}
          hasMore={hasMore}
          renderItem={renderItem}
          renderEmpty={renderEmpty}
          productsWrapperProps={{
            justifyContent: 'flex-start',
          }}
        />
      </Box>
    </>
  );
};

export default memo(Marketplace);
