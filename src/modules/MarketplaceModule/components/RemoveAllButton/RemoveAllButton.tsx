import { Button } from '@alycecom/ui';
import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

import {
  getCustomMarketplaceProductsCount,
  getIsBulkLoading,
} from '../../store/customMarketplace/customMarketplace.selectors';
import { removeAllProductsFromMarketplace } from '../../store/customMarketplace/customMarketplace.actions';
import { getPagination } from '../../store/products/products.selectors';

const RemoveAllButton = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsBulkLoading);
  const { total } = useSelector(getPagination);
  const addedCount = useSelector(getCustomMarketplaceProductsCount);
  const isDisabled = isLoading || addedCount === 0 || total === 0;

  const removeAllProducts = useCallback(() => {
    dispatch(removeAllProductsFromMarketplace());
  }, [dispatch]);

  return (
    <Button
      {...props}
      variant="text"
      color="red"
      onClick={removeAllProducts}
      disabled={isDisabled}
      startIcon={isLoading ? <CircularProgress color="inherit" size={20} /> : null}
    >
      Remove All from Marketplace
    </Button>
  );
};

export default memo(RemoveAllButton);
