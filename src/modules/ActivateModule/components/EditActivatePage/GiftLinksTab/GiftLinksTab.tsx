import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';
import { CampaignSettings } from '@alycecom/modules';

import { downloadGiftLinks, fetchGiftLinks, resetGiftLinks } from '../../../store/entities/giftLinks/giftLinks.actions';
import { getIsCanLoadMore, getIsExportGiftLinksPending } from '../../../store/entities/giftLinks/giftLinks.selectors';
import { useActivate } from '../../../hooks/useActivate';
import TabTitle from '../../TabTitle';
import { getActivateLink, getDetailsData, getSendAsOption } from '../../../store/steps/details';
import { DetailsConstants } from '../../../constants/details.constants';
import GiftLinkDetails from '../DetailsTab/GiftLinkDetails';
import { ClaimType } from '../../../store';

import GiftLinksSearch from './GiftLinksSearch';
import GiftLinksTable from './GiftLinksTable';
import FreeClaimsForm from './FreeClaimsForm';

const GiftLinksTab = (): JSX.Element => {
  const dispatch = useDispatch();
  const details = useSelector(getDetailsData);
  const { campaignId } = useActivate();
  const isCanLoadMore = useSelector(getIsCanLoadMore);
  const isExportPending = useSelector(getIsExportGiftLinksPending);
  const sendAsOption = useSelector(getSendAsOption);
  const isMultiLinksEnabled = sendAsOption === DetailsConstants.Multiple;
  const campaignLink = useSelector(getActivateLink);

  const isFreeClaimEnabled = details?.claimType === ClaimType.FreeClaim;

  useEffect(() => {
    if (campaignId) {
      dispatch(fetchGiftLinks({ campaignId }));
    }
  }, [dispatch, campaignId]);

  useEffect(
    () => () => {
      dispatch(resetGiftLinks());
    },
    [dispatch],
  );

  const handleLoadMore = useCallback(() => {
    if (isCanLoadMore && campaignId) {
      dispatch(fetchGiftLinks({ campaignId }));
    }
  }, [dispatch, campaignId, isCanLoadMore]);

  const handleExport = useCallback(() => {
    if (campaignId) {
      dispatch(downloadGiftLinks({ campaignId }));
    }
  }, [dispatch, campaignId]);

  return (
    <CampaignSettings.Layout2Columns>
      <TabTitle mb={2}>Team Gift Links</TabTitle>
      {!isMultiLinksEnabled && campaignId && campaignLink && (
        <GiftLinkDetails campaignId={campaignId} link={campaignLink} />
      )}
      {isFreeClaimEnabled && <FreeClaimsForm />}
      {isMultiLinksEnabled && (
        <>
          <Box color="text.primary">Copy and paste these unique gift links into your messages to recipients.</Box>
          <Box color="text.primary" fontStyle="italic" mt={1} mb={4}>
            For optimal conversion, we recommend incorporating the messages into your existing engagement cadences and
            <br />
            leveraging at least 2-3 outreach attempts leveraging channels like email, LinkedIn and phone calls.
          </Box>
          <Box display="flex" justifyContent="space-between" pb={2} width={809}>
            <Box width={340}>
              <GiftLinksSearch />
            </Box>
            <Button
              onClick={handleExport}
              disabled={isExportPending}
              startIcon={<Icon icon="file-download" />}
              variant="text"
            >
              Export Results as .XLS
            </Button>
          </Box>
        </>
      )}
      <TabTitle mb={2}>Calendar Connection Status</TabTitle>
      <GiftLinksTable displayLinks={isMultiLinksEnabled} onLoadMore={handleLoadMore} />
    </CampaignSettings.Layout2Columns>
  );
};

export default GiftLinksTab;
