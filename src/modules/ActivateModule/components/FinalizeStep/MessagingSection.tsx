import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { CampaignSettings } from '@alycecom/modules';

import { getMessagingData } from '../../store/steps/messaging/messaging.selectors';
import { LandingPageContents, PostGiftActions } from '../../store/steps/messaging/messaging.types';
import { getTeamId } from '../../store/steps/details';
import { useSenderFullname } from '../../hooks/useSenderFullname';

const landingPageContentTypeText = {
  [LandingPageContents.Text]: 'a short message',
  [LandingPageContents.EmbedVideo]: 'embedded video',
  [LandingPageContents.Vidyard]: 'Vidyard video',
};

const MessagingSection = (): JSX.Element => {
  const dispatch = useDispatch();
  const messaging = useSelector(getMessagingData);
  const isMembersLoaded = useSelector(CampaignSettings.selectors.getIsTeamMembersLoaded);
  const teamId = useSelector(getTeamId);

  const senderFullName = useSenderFullname();

  useEffect(() => {
    if (!isMembersLoaded && teamId) {
      dispatch(CampaignSettings.actions.loadTeamMembersRequest(teamId as number));
    }
  }, [isMembersLoaded, teamId, dispatch]);

  return (
    <>
      <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
        Messaging
      </CampaignSettings.StyledSectionTitle>

      <Box mb={9} maxWidth={650}>
        <Box mt={1}>
          <Typography>All messages coming from {senderFullName}</Typography>
          {messaging && (
            <Typography>
              Includes {landingPageContentTypeText[messaging.landingPageContentType]}
              {messaging && messaging.postGiftAction === PostGiftActions.Redirect && <span> & post-gift CTA</span>}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MessagingSection;
