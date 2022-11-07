import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { TProduct } from '../../../store/entities/defaultGiftProducts/defaultGiftProducts.types';
import { getCountryIds } from '../../../store/steps/details';

import EmptyProductCardItem from './EmptyProductCardItem';
import ProductCardItem from './ProductCardItem';

interface IMultiCountryDefaultGiftsProps {
  products: TProduct[];
  onSelectGift?: (countryId: number) => void;
}

const MultiCountryDefaultGifts = ({ products, onSelectGift }: IMultiCountryDefaultGiftsProps): JSX.Element => {
  const campaignCountries = useSelector(getCountryIds);
  const selectedGiftsCount = products.length;

  return (
    <Box>
      <Box mb={3}>
        <Typography className="Body-Regular-Left-Static-Bold">
          Selected gift{campaignCountries && campaignCountries.length === 1 ? '' : `s: `}
          {campaignCountries && campaignCountries.length > 1 && (
            <Box color="link.main" display="inline" component="span">
              {selectedGiftsCount}/{campaignCountries.length} countries
            </Box>
          )}
        </Typography>
      </Box>
      <Box display="flex" maxWidth={600} flexWrap="wrap" gap="24px">
        {campaignCountries?.map(countryId => {
          const selectedProduct = products.find(product => product.countryId === countryId);
          return selectedProduct ? (
            <ProductCardItem product={selectedProduct} onChangeGift={onSelectGift} key={countryId} />
          ) : (
            <EmptyProductCardItem countryId={countryId} onSelectGift={onSelectGift} key={countryId} />
          );
        })}
      </Box>
    </Box>
  );
};
export default memo(MultiCountryDefaultGifts);
