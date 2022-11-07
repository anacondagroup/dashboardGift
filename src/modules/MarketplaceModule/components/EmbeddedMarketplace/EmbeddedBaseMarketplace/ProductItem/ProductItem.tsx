import React, { useCallback, memo, useEffect } from 'react';
import { IProduct } from '@alycecom/ui';
import { Marketplace } from '@alycecom/modules';
import { Box } from '@mui/material';

const styles = {
  product: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    height: '100%',
    p: 1,
  },
} as const;

export interface IProductItemProps {
  product?: IProduct;
  onClick: (product: IProduct) => void;
  measure: () => void;
  selected?: boolean;
}

const ProductItem = ({ product, measure, onClick, selected = false }: IProductItemProps): JSX.Element => {
  const handleClick = useCallback(() => {
    if (product) {
      onClick(product);
    }
  }, [product, onClick]);

  useEffect(() => {
    if (product) {
      measure();
    }
  }, [measure, product]);

  return (
    <Box sx={styles.wrapper}>
      <Marketplace.SelectableProductItem
        onImageLoaded={measure}
        onClick={handleClick}
        name={product?.name ?? ''}
        loading={!product}
        price={product?.localPrice?.price}
        currencySign={product?.localPrice?.currencySign}
        image={product?.image}
        countryId={product?.countryId}
        provider={(product?.hasExternalFulfillment && product?.provider) || ''}
        sx={styles.product}
        selected={selected}
        fullText
      />
    </Box>
  );
};

export default memo(ProductItem);
