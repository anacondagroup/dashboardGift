import React, { useCallback } from 'react';
import { Box, Link, TextField, Typography, Theme, outlinedInputClasses } from '@mui/material';
import { Button } from '@alycecom/ui';
import { CampaignSettings } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';

import {
  useTrackCampaignBuilderCopyButtonClicked,
  useTrackCampaignEditorUnexpireClicked,
} from '../../../hooks/useTrackActivate';
import { getIsCampaignExpired, getIsDetailsLoading } from '../../../store/steps/details';
import { unExpireActivateOrSwagCampaigns } from '../../../../DashboardModule/store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.actions';

import CopyToClipboardButton from './CopyToClipboardButton';

const styles = {
  block: {
    display: 'flex',
    flexDirection: 'column',
    width: 684,
    borderRadius: '5px',
    padding: ({ spacing }: Theme) => spacing(4, 5, 3, 5),
    backgroundColor: ({ palette }: Theme) => palette.primary.superLight,
    marginBottom: ({ spacing }: Theme) => spacing(4),
  },
  linkControl: {
    [`& .${outlinedInputClasses.root}`]: {
      flex: 1,
      background: 'transparent',
    },
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 'normal',
  },
  text: {
    fontSize: 14,
    lineHeight: 'normal',
  },
  link: {
    display: 'inline-block',
    p: 0,
    m: 0,
    verticalAlign: 'inherit',

    '&:hover': {
      textDecoration: 'none',
    },
  },
  linkSmall: {
    fontSize: 14,
  },
  warn: {
    px: 2,
    py: 1,
    mb: 2,
    backgroundColor: 'red.superLight',
    borderRadius: 1,
  },
} as const;

interface IGiftLinkDetailsProps {
  campaignId: number;
  link: string;
}

const GiftLinkDetails = ({ campaignId, link }: IGiftLinkDetailsProps): JSX.Element => {
  const dispatch = useDispatch();
  const isExpired = useSelector(getIsCampaignExpired);
  const isLoading = useSelector(getIsDetailsLoading);

  const trackCopyLinkButtonClicked = useTrackCampaignBuilderCopyButtonClicked();
  const trackUnexpireClicked = useTrackCampaignEditorUnexpireClicked({ campaignId });

  const handleCopyLink = useCallback(() => {
    trackCopyLinkButtonClicked(campaignId);
  }, [trackCopyLinkButtonClicked, campaignId]);

  const handleUnexpire = () => {
    dispatch(unExpireActivateOrSwagCampaigns({ campaignIds: [campaignId] }));
    trackUnexpireClicked();
  };

  return (
    <Box>
      <CampaignSettings.SectionTitle>Gift link Details</CampaignSettings.SectionTitle>

      <Box sx={styles.block}>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Copy Gift Link"
            variant="outlined"
            value={link}
            disabled
            inputProps={{ 'data-testid': 'ActivateCampaign.GiftLink' }}
            fullWidth
            sx={styles.linkControl}
          />

          <Box ml={4} width={200}>
            <CopyToClipboardButton value={link} onCopy={handleCopyLink}>
              Copy Link
            </CopyToClipboardButton>
          </Box>
        </Box>

        {isExpired && (
          <Box sx={styles.warn}>
            Want to send more gifts? Increase total claims amount to this campaign below and then&nbsp;
            <Button disabled={isLoading} onClick={handleUnexpire} variant="text" sx={styles.link} disableRipple>
              Unexpire this campaign
            </Button>
          </Box>
        )}

        <Box>
          <Typography sx={styles.bold}>
            Copy and paste this link into messages that you’re sending to recipients.
          </Typography>
          <Typography sx={styles.text}>
            Recipients will be taken to this{' '}
            <Link href={link} target="_blank" sx={[styles.link, styles.linkSmall]}>
              Gift Redemption Landing Page.
            </Link>
          </Typography>
        </Box>
        <Box mt={2} fontStyle="italic">
          For optimal conversion, we recommend incorporating the messages into your existing engagement cadences and
          leveraging at least 2-3 outreach attempts leveraging channels like email, LinkedIn and phone calls.
        </Box>
      </Box>
    </Box>
  );
};

export default GiftLinkDetails;
