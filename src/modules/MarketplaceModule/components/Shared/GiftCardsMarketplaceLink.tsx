import React, { useMemo, memo } from 'react';
import { Link } from '@mui/material';

import { ProductFilter } from '../../store/products/products.types';
import { PRODUCT_TYPES } from '../../store/entities/productTypes/productTypes.constants';
import { MARKETPLACE_ROUTES } from '../../routePaths';

export interface IGiftCardsMarketplaceLinkProps {
  giftCardPrice: number;
  countryIds: number[];
  className?: string;
}

const GiftCardsMarketplaceLink = ({
  giftCardPrice,
  countryIds,
  className,
}: IGiftCardsMarketplaceLinkProps): JSX.Element => {
  const giftCardsMarketplaceLink = useMemo(() => {
    const filters = {
      [ProductFilter.TypeIds]: [PRODUCT_TYPES.GIFT_CARD],
      [ProductFilter.CountryIds]: countryIds,
      [ProductFilter.GiftCardPrice]: giftCardPrice,
    };
    return MARKETPLACE_ROUTES.buildMarketplacePathWithFilter(filters);
  }, [countryIds, giftCardPrice]);

  return (
    <Link classes={{ root: className }} href={giftCardsMarketplaceLink} target="_blank">
      Preview Gift Card Marketplace
    </Link>
  );
};

export default memo(GiftCardsMarketplaceLink);
