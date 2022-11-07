import React from 'react';
import { Box } from '@mui/material';
import { Messaging, SectionTitleStyled, SFormLabel } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import { Icon, Tooltip } from '@alycecom/ui';

import { getMessagingData } from '../../../store/swagCampaign/steps/messaging/messaging.selectors';

const styles = {
  labelWithTooltip: {
    display: 'flex',
  },
  labelTooltip: {
    ml: 1,
  },
} as const;

const MessagingDetailsSection = (): JSX.Element => {
  const messaging = useSelector(getMessagingData);
  const messagingTitle = messaging?.messageData?.pageHeader;
  const messagingContent = messaging?.messageData?.pageBody;

  return (
    <>
      <SectionTitleStyled my={3} mt={5} style={styles.labelWithTooltip}>
        Messaging Details
        {(!!messagingTitle || !!messagingContent) && (
          <Tooltip
            placement="top"
            title="The highlighted texts are custom data placeholders for this message preview and will be replaced with the values of your contacts and gift information upon sending."
            component="span"
          >
            <Icon sx={styles.labelTooltip} icon="exclamation-circle" fontSize={1} />
          </Tooltip>
        )}
      </SectionTitleStyled>
      {!!messagingTitle && (
        <Box my={2}>
          <SFormLabel>Header</SFormLabel>
          <Box data-testid="SwagBuilder.FinalizeStep.Messaging.Header">
            <Messaging.TextWithPlaceholders text={messagingTitle} />
          </Box>
        </Box>
      )}
      {!!messagingContent && (
        <Box my={2}>
          <SFormLabel>Landing Page Content</SFormLabel>
          <Box data-testid="SwagBuilder.FinalizeStep.Messaging.Content">
            <Messaging.TextWithPlaceholders text={messagingContent} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default MessagingDetailsSection;
