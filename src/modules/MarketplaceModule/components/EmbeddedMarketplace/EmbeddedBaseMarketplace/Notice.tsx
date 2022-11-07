import React, { memo } from 'react';
import { MarketplaceNotice } from '@alycecom/ui';

export interface INoticeProps {
  productsCount: number;
  filtersCount: number;
}

const Notice = ({ productsCount, filtersCount }: INoticeProps) => (
  <MarketplaceNotice productsCount={productsCount} filtersCount={filtersCount} />
);

export default memo(Notice);
