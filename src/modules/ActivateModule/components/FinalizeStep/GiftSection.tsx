import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { CampaignSettings } from '@alycecom/modules';

import { getSelectedRecipientActions } from '../../store/steps/gift';
import { IDefaultGift } from '../../store/activate.types';

interface IGiftSectionProps {
  defaultGift: IDefaultGift[];
}

const GiftSection = ({ defaultGift }: IGiftSectionProps): JSX.Element => {
  const selectedRecipientActions = useSelector(getSelectedRecipientActions);
  return (
    <Box mb={9}>
      <CampaignSettings.SectionTitle>Gift</CampaignSettings.SectionTitle>

      <Box mb={1}>
        <Typography className="Body-Regular-Left-Static-Bold">Default Gift</Typography>
      </Box>

      <CampaignSettings.DefaultGift productId={defaultGift[0].productId} denomination={defaultGift[0].denomination} />

      {selectedRecipientActions && (
        <Box mt={4}>
          <Typography className="Body-Regular-Left-Static-Bold">Acceptance Requirements</Typography>
          <Typography>Recipients must {selectedRecipientActions}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default GiftSection;
