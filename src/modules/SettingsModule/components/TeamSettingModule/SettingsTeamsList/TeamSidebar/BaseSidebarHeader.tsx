import React, { memo } from 'react';

import HeaderContent from './HeaderContent';

export interface IBaseSidebarHeaderProps {
  onClose: () => void;
}

const BaseSidebarHeader = ({ onClose }: IBaseSidebarHeaderProps): JSX.Element => (
  <HeaderContent text="Create a team" onClose={onClose} />
);

export default memo(BaseSidebarHeader);
