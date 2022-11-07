import { IProduct } from '@alycecom/ui';
import { useCallback, useMemo, useState } from 'react';

export const useProductDetails = (): {
  product: IProduct | undefined;
  handleOpenDetails: (arg0: IProduct) => void;
  handleCloseDetails: () => void;
} => {
  const [product, setProduct] = useState<IProduct | undefined>(undefined);

  const handleOpen = useCallback((nextProduct: IProduct) => {
    setProduct(nextProduct);
  }, []);

  const handleClose = useCallback(() => {
    setProduct(undefined);
  }, []);

  return useMemo(
    () => ({
      product,
      handleOpenDetails: handleOpen,
      handleCloseDetails: handleClose,
    }),
    [product, handleOpen, handleClose],
  );
};
