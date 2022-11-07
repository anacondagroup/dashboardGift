import React from 'react';
import { ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { Box } from '@mui/material';

import { ActivateMarketplaceForm } from '../ActivateMarketplaceForm';

export interface IActivateMarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivateMarketplaceSidebar = ({ isOpen, onClose }: IActivateMarketplaceSidebarProps): JSX.Element => (
  <ProductSidebar isOpen={isOpen} onClose={onClose} width={550}>
    <Box display="flex" flexDirection="column" bgcolor="common.white" height="max(100%, 100vh)">
      <ProductSidebarHeader onClose={onClose}>
        <Box ml={2} fontSize="20px">
          Marketplace Editor
        </Box>
      </ProductSidebarHeader>
      <ActivateMarketplaceForm onCancel={onClose} />
    </Box>
  </ProductSidebar>
);

export default ActivateMarketplaceSidebar;
