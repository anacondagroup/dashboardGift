import React, { useMemo, memo } from 'react';
import { IProduct, MarketplaceGridItem } from '@alycecom/ui';
import { Zoom } from '@mui/material';
import { useSelector } from 'react-redux';
import { CommonData, User } from '@alycecom/modules';

import { getIsLoaded } from '../../store/customMarketplace/customMarketplace.selectors';

export interface IMarketplaceItemProps {
  product: IProduct;
  transitionDelay: string;
  onRemove?: false | ((id: number) => void);
  onAdd?: false | ((id: number) => void);
  isAdded?: boolean;
  onDetails: (product: IProduct) => void;
  disabled?: boolean;
}

const MarketplaceItem = ({
  product,
  transitionDelay,
  onRemove = undefined,
  onAdd = undefined,
  isAdded = false,
  disabled,
  onDetails,
}: IMarketplaceItemProps): JSX.Element => {
  const { id, image, name, provider, localPrice, countryId, hasExternalFulfillment } = product;

  const { image: flag } = useSelector(useMemo(() => CommonData.selectors.makeGetCountryById(countryId), [countryId]));

  const handleRemove = useMemo(() => !!onRemove && isAdded && (() => onRemove(id)), [onRemove, isAdded, id]);
  const handleAdd = useMemo(() => !!onAdd && !isAdded && (() => onAdd(id)), [onAdd, isAdded, id]);
  const handlePreview = useMemo(() => () => onDetails(product), [onDetails, product]);
  const hasDisableMargin = useSelector(User.selectors.getHasDisableMargin);
  const marketplaceLoaded = useSelector(getIsLoaded);

  return (
    <Zoom in style={{ transitionDelay }}>
      <MarketplaceGridItem
        key={id}
        image={image}
        title={name}
        subtitle={provider}
        hasExternalFulfillment={hasExternalFulfillment}
        currency={localPrice?.currencySign}
        price={localPrice?.price}
        flag={flag}
        onClickRemove={handleRemove}
        onClickAdd={handleAdd}
        onClickPreview={handlePreview}
        disabled={disabled}
        added={isAdded}
        m={1}
        data-testid={`marketplace-product-item-${id}`}
        showStarOnPrice={hasDisableMargin && !marketplaceLoaded}
      />
    </Zoom>
  );
};

export default memo(MarketplaceItem);
