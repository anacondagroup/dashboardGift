import React, { useCallback, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { IProduct, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { Control, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { TProspectingDefaultGift } from '../../../../../store/prospectingCampaign/prospectingCampaign.types';
import ProspectingMarketplace from '../ProspectingMarketplace';
import {
  CustomMarketplaceDataFields,
  GiftingStepFields,
  TProspectingGiftingForm,
} from '../../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { getDetailsData } from '../../../../../store/prospectingCampaign/steps/details/details.selectors';
import { EmbeddedCustomMarketplace } from '../../../../../../MarketplaceModule/components/EmbeddedMarketplace';

export interface IMarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: ({ id, denomination }: TProspectingDefaultGift) => void;
  control: Control<TProspectingGiftingForm>;
}

const MarketplaceSidebar = ({ isOpen, onClose, onSelect, control }: IMarketplaceSidebarProps): JSX.Element => {
  const { teamId, countryIds } = useSelector(getDetailsData) || {};

  const customMarketplaceId = useWatch({
    control,
    name: `${GiftingStepFields.CustomMarketplaceData}.${CustomMarketplaceDataFields.MarketplaceId}` as const,
  });

  const handleSelectDefaultGift = useCallback(
    ({ id, denomination }: IProduct) => {
      onSelect({ id, denomination: denomination?.price ?? null });
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
          {!customMarketplaceId && (
            <ProspectingMarketplace onClickProduct={handleSelectDefaultGift} control={control} />
          )}
          {!!customMarketplaceId && !!countryIds && (
            <EmbeddedCustomMarketplace
              countryIds={countryIds}
              teamId={teamId}
              marketplaceId={Number(customMarketplaceId)}
              onClickProduct={handleSelectDefaultGift}
              columnsCount={4}
              showCountry
            />
          )}
        </Box>
      </Box>
    </ProductSidebar>
  );
};

export default memo(MarketplaceSidebar);
