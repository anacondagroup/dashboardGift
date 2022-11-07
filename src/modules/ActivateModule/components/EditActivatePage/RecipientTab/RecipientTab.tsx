import React, { memo } from 'react';
import { CampaignSettings } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { useActivate } from '../../../hooks/useActivate';
import TabTitle from '../../TabTitle';
import { getIsFreeClaimEnabled } from '../../../store/steps/details';

import ContactsSection from './ContactsSection';

const styles = {
  freeClaimTip: {
    backgroundColor: 'green.fruitSalad20',
    color: 'text.primary',
    py: 3,
    px: 4,
    mb: 5,
    borderRadius: 1,
  },
  tipTitle: {
    fontSize: '18px',
    fontWeight: 700,
    pb: 2,
  },
} as const;

const RecipientTab = (): JSX.Element => {
  const { campaignId } = useActivate();
  const isFreeClaimEnabled = useSelector(getIsFreeClaimEnabled);

  if (!campaignId) {
    return <></>;
  }

  return (
    <CampaignSettings.Layout2Columns>
      {isFreeClaimEnabled && (
        <Box sx={styles.freeClaimTip}>
          <Box sx={styles.tipTitle}>You have enabled unknown recipients for this campaign</Box>
          <b>Please note:</b> anybody who has access to the link will be able to claim the gift.
        </Box>
      )}
      <TabTitle mb={1}>Approved Gift Recipients</TabTitle>
      <ContactsSection campaignId={campaignId} />
    </CampaignSettings.Layout2Columns>
  );
};

export default memo(RecipientTab);
