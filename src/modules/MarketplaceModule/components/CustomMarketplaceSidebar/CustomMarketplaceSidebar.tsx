import React from 'react';
import { ProductSidebar } from '@alycecom/ui';

import { CustomMarketplaceForm } from '../CustomMarketplaceForm';

export interface ICustomMarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomMarketplaceSidebar = ({ isOpen, onClose }: ICustomMarketplaceSidebarProps): JSX.Element => (
  <ProductSidebar isOpen={isOpen} onClose={onClose}>
    <CustomMarketplaceForm onCancel={onClose} />
  </ProductSidebar>
);

export default CustomMarketplaceSidebar;
