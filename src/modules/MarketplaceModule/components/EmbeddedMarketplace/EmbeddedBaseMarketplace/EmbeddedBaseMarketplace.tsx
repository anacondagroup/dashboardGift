import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { EmptyListMessage, IProduct } from '@alycecom/ui';
import { Box, BoxProps } from '@mui/material';

import {
  getAppliedFiltersCount,
  getHasMore,
  getHasSelectedFilters,
  getIsLoading,
  getPagination,
  getProducts,
  getSearch,
} from '../../../store/products/products.selectors';
import { resetProductsState, setDefaultFilters, setPage } from '../../../store/products/products.actions';
import { resetTeamSettings } from '../../../store/teamSettings/teamSettings.actions';

import Notice, { INoticeProps } from './Notice';
import FiltersPanel, { IFiltersPanelProps } from './FiltersPanel';
import ProductGrid, { IProductGridProps } from './ProductGrid/ProductGrid';
import ProductItem from './ProductItem/ProductItem';

export interface IEmbeddedBaseMarketplaceProps {
  onClickProduct: (product: IProduct) => void;
  isReady: boolean;
  restrictedTypeIds?: number[];
  disableBudget?: boolean;
  syncBudget?: boolean;
  showCountry?: boolean;
  columnsCount?: number;
  columnWidth?: number;
  renderFiltersPanel?: React.FunctionComponent<IFiltersPanelProps>;
  renderFiltersChips?: React.FunctionComponent;
  renderNotice?: React.FunctionComponent<INoticeProps>;
  getIsProductSelected?: (product: IProduct) => boolean;
  gridProps?: Partial<IProductGridProps>;
  filtersPanelWrapperProps?: BoxProps;
}

const EmbeddedBaseMarketplace = ({
  onClickProduct,
  isReady,
  restrictedTypeIds,
  disableBudget,
  syncBudget = false,
  columnsCount,
  renderFiltersPanel = (props: IFiltersPanelProps) => <FiltersPanel {...props} />,
  renderFiltersChips = () => null,
  renderNotice = (props: INoticeProps) => <Notice {...props} />,
  getIsProductSelected,
  gridProps = {},
  filtersPanelWrapperProps = {},
}: IEmbeddedBaseMarketplaceProps) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoading);
  const products = useSelector(getProducts);
  const hasMore = useSelector(getHasMore);
  const pagination = useSelector(getPagination);
  const appliedFiltersCount = useSelector(getAppliedFiltersCount);
  const hasFilters = useSelector(getHasSelectedFilters);
  const search = useSelector(getSearch);

  useEffect(
    () => () => {
      batch(() => {
        dispatch(setDefaultFilters({}));
        dispatch(resetTeamSettings());
        dispatch(resetProductsState());
      });
    },
    [dispatch],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && isReady) {
      setScrollToRow(undefined);
      const page = pagination.currentPage + 1;
      dispatch(setPage(page));
    }
  }, [pagination, dispatch, isLoading, hasMore, isReady]);

  const emptyMessage = useMemo(() => {
    if (search && !hasFilters) {
      return `There are no products for "${search}".`;
    }
    if (search && hasFilters) {
      return `There are no products for "${search}" and selected filters.`;
    }
    if (!search && hasFilters) {
      return `There are no products for selected filters.`;
    }
    return 'There are no products available.';
  }, [search, hasFilters]);
  const renderEmpty = useCallback(
    () => (
      <Box>
        <EmptyListMessage message={emptyMessage} />
      </Box>
    ),
    [emptyMessage],
  );

  const [scrollToRow, setScrollToRow] = useState<number | undefined>(undefined);
  const scrollToTop = useCallback(() => setScrollToRow(0), []);

  const renderProduct = useCallback(
    (index: number, measure: () => void) => {
      const product = products[index];
      return (
        <ProductItem
          product={product}
          selected={!!product && !!getIsProductSelected && getIsProductSelected(product)}
          onClick={onClickProduct}
          measure={measure}
        />
      );
    },
    [getIsProductSelected, onClickProduct, products],
  );

  return (
    <Box height={1} display="flex" flexDirection="column">
      <Box mx={3} my={1} {...filtersPanelWrapperProps}>
        {renderFiltersPanel({ restrictedTypeIds, disableBudget, syncBudget, onChange: scrollToTop })}
      </Box>
      <Box ml={4} mt={1}>
        {renderFiltersChips({})}
      </Box>
      <Box ml={3} mt={1}>
        {renderNotice({ productsCount: pagination.total, filtersCount: appliedFiltersCount })}
      </Box>
      <Box height={1} mx={2} flex="1 1 auto">
        <ProductGrid
          {...gridProps}
          productsLength={products.length}
          hasMore={hasMore}
          onLoadMore={loadMore}
          scrollToRow={scrollToRow}
          renderEmpty={renderEmpty}
          columnsCount={columnsCount}
          renderProduct={renderProduct}
        />
      </Box>
    </Box>
  );
};

export default memo(EmbeddedBaseMarketplace);
