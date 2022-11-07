import React, { useCallback, memo } from 'react';
import { IProduct, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { TSwagDefaultGift } from '../../../../../store/swagCampaign/swagCampaign.types';
import { EmbeddedCustomMarketplace } from '../../../../../../MarketplaceModule/components/EmbeddedMarketplace';
import { getDetailsData } from '../../../../../store/swagCampaign/steps/details/details.selectors';

export interface IMarketplaceSidebarProps {
  isOpen: boolean;
  customMarketplaceId: number;
  onClose: () => void;
  onSelect: ({ productId, denomination }: TSwagDefaultGift) => void;
}

const CustomMarketplaceSidebar = ({
  isOpen,
  customMarketplaceId,
  onClose,
  onSelect,
}: IMarketplaceSidebarProps): JSX.Element => {
  const { teamId, countryIds } = useSelector(getDetailsData) || {};

  const handleSelectDefaultGift = useCallback(
    ({ id, denomination }: IProduct) => {
      onSelect({ productId: id, denomination: denomination?.price ?? null });
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <ProductSidebar isOpen={isOpen} onClose={onClose} width={800}>
      <Box display="flex" flexDirection="column" bgcolor="common.white" height="max(100%, 100vh)">
        <ProductSidebarHeader onClose={onClose}>
          <Box ml={2} fontSize="20px">
            Select Leading Gift
          </Box>
        </ProductSidebarHeader>
        <Box p={2} pl={5}>
          <Typography className="H4-Chambray">Let`s browse the Marketplace</Typography>
        </Box>
        <Box height="calc(100vh - 138px)" overflow="hidden">
          {!!countryIds && (
            <EmbeddedCustomMarketplace
              marketplaceId={customMarketplaceId}
              teamId={teamId}
              countryIds={countryIds}
              onClickProduct={handleSelectDefaultGift}
            />
          )}
        </Box>
      </Box>
    </ProductSidebar>
  );
};

export default memo(CustomMarketplaceSidebar);
