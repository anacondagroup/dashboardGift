import React, { useCallback } from 'react';
import { IProduct, SidebarHeader as HeaderTopBar } from '@alycecom/ui';
import { Box, Drawer } from '@mui/material';

import giftingFlowImage from '../../../../../../../../../assets/images/contact-details-top-bar.svg';
import { getCampaignTypeName } from '../../../../../../../../../helpers/campaignSettings.helpers';
import { CAMPAIGN_TYPES } from '../../../../../../../../../constants/campaignSettings.constants';
import CampaignSidebarSectionWrapper from '../../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CampaignSidebarSectionWrapper';
import { EmbeddedCampaignMarketplace } from '../../../../../../../../MarketplaceModule/components/EmbeddedMarketplace';

export interface ISwagSelectDefaultProductSidebarProps {
  onChange: (product: IProduct) => void;
  onClose: () => void;
  open: boolean;
  campaignId?: number;
}

const SwagSelectDefaultProductSidebar = ({
  onClose,
  onChange,
  open,
  campaignId,
}: ISwagSelectDefaultProductSidebarProps): JSX.Element => {
  const handleChange = useCallback(
    (product: IProduct) => {
      onChange(product);
    },
    [onChange],
  );

  return (
    <Drawer anchor="right" onClose={onClose} open={open}>
      <HeaderTopBar onClose={onClose} bgTheme="green-light-gradient" bgImage={giftingFlowImage}>
        <Box fontSize="1.25rem" color="common.white" width={700}>
          Create a {getCampaignTypeName(CAMPAIGN_TYPES.SWAG)} campaign!
        </Box>
      </HeaderTopBar>
      <Box px={6} py={4}>
        <CampaignSidebarSectionWrapper status="ACTIVE">
          <Box px={3}>
            <Box mb={4} className="H4-Chambray">
              Marketplace
            </Box>
            <Box height="calc(100vh - 268px)" overflow="hidden">
              {campaignId && <EmbeddedCampaignMarketplace campaignId={campaignId} onClickProduct={handleChange} />}
            </Box>
          </Box>
        </CampaignSidebarSectionWrapper>
      </Box>
    </Drawer>
  );
};

export default SwagSelectDefaultProductSidebar;
