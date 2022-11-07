import React from 'react';
import { Typography } from '@mui/material';
import { SidebarHeader as HeaderTopBar } from '@alycecom/ui';

import giftingFlowImage from '../../../../assets/images/contact-details-top-bar.svg';

export interface ISelectCampaignSidebarHeaderProps {
  onClose: () => void;
}

const SelectCampaignSidebarHeader = ({ onClose }: ISelectCampaignSidebarHeaderProps): JSX.Element => (
  <HeaderTopBar onClose={onClose} bgImage={giftingFlowImage}>
    <Typography className="H4-White">Select a Gifting Campaign!</Typography>
  </HeaderTopBar>
);

export default SelectCampaignSidebarHeader;
