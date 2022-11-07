import { Button, Icon } from '@alycecom/ui';
import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { getIsBulkLoading } from '../../store/customMarketplace/customMarketplace.selectors';
import { addAllProductsToMarketplace } from '../../store/customMarketplace/customMarketplace.actions';
import { getPagination } from '../../store/products/products.selectors';
import { useTrackCustomMarketplaceProductAdded } from '../../hooks/useTrackCustomMarketplace';

const AddAllButton = ({ ...props }) => {
  const dispatch = useDispatch();
  const isAddAllLoading = useSelector(getIsBulkLoading);
  const { total } = useSelector(getPagination);
  const isDisabled = isAddAllLoading || total === 0;
  const trackProductAdded = useTrackCustomMarketplaceProductAdded();

  const addAllProducts = useCallback(() => {
    dispatch(addAllProductsToMarketplace());
    trackProductAdded('bulk');
  }, [dispatch, trackProductAdded]);

  return (
    <Button
      {...props}
      onClick={addAllProducts}
      disabled={isDisabled}
      borderColor="divider"
      startIcon={isAddAllLoading ? <CircularProgress color="inherit" size={20} /> : <Icon icon="check-square" />}
    >
      Add All to Marketplace
    </Button>
  );
};

export default memo(AddAllButton);
