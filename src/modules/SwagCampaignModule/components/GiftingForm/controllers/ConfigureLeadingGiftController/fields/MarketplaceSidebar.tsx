import React, { useCallback, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { IProduct, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { Control } from 'react-hook-form';

import { TSwagDefaultGift } from '../../../../../store/swagCampaign/swagCampaign.types';
import SwagMarketplace from '../SwagMarketplace';
import { TSwagCampaignGiftingForm } from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

import { styles } from './MarketplaceSidebarStyles';

export interface IMarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: ({ productId, denomination }: TSwagDefaultGift) => void;
  control: Control<TSwagCampaignGiftingForm>;
}

const MarketplaceSidebar = ({ isOpen, onClose, onSelect, control }: IMarketplaceSidebarProps): JSX.Element => {
  const handleSelectDefaultGift = useCallback(
    ({ id, denomination }: IProduct) => {
      onSelect({ productId: id, denomination: denomination?.price ?? null });
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <ProductSidebar isOpen={isOpen} onClose={onClose} width={800}>
      <Box sx={styles.containerBox}>
        <ProductSidebarHeader onClose={onClose}>
          <Box sx={styles.buttonText}>Select Leading Gift</Box>
        </ProductSidebarHeader>
        <Box sx={styles.subTitleBox}>
          <Typography className="H4-Chambray">Let`s browse the Marketplace</Typography>
        </Box>
        <Box sx={styles.marketplaceContainer}>
          <SwagMarketplace onClickProduct={handleSelectDefaultGift} control={control} />
        </Box>
      </Box>
    </ProductSidebar>
  );
};

export default memo(MarketplaceSidebar);
