import React, { memo, useCallback } from 'react';
import { GiftingFlow } from '@alycecom/modules';
import { SidebarHeader } from '@alycecom/ui';
import { Typography, Skeleton } from '@mui/material';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';
import { useGetCampaignByIdQuery, useGetProspectingBatchByIdQuery } from '@alycecom/services';
import { skipToken } from '@reduxjs/toolkit/query';
import { EntityId } from '@reduxjs/toolkit';

import giftingFlowImage from '../../../assets/images/contact-details-top-bar.svg';

import ContactsStep from './ContactsStep';
import SelectGiftStep from './SelectGiftStep';
import MessagingStep from './MessagingStep';
import SendingStep from './SendingStep/SendingStep';

export interface IGiftingFlowModuleProps {
  onClose: () => void;
}

const styles = {
  skeleton: {
    backgroundColor: 'common.white',
  },
  header: {
    color: 'common.white',
    lineHeight: 'normal',
    fontSize: 20,
    maxWidth: 520,
  },
} as const;

const GiftingFlowModule = ({ onClose }: IGiftingFlowModuleProps): JSX.Element => {
  const { campaignId, batchId: batchIdFromUrl } = useUrlQuery<{ campaignId: string; batchId: string }>([
    'campaignId',
    'batchId',
  ]);
  const step = GiftingFlow.hooks.useActiveStep();
  const { data: batch } = useGetProspectingBatchByIdQuery(
    batchIdFromUrl ? { batchId: Number(batchIdFromUrl) } : skipToken,
  );
  const { data: campaign, isSuccess: isFulfilled } = useGetCampaignByIdQuery(
    Number(campaignId) || batch?.campaignId || skipToken,
  );
  const setUrlQuery = useSetUrlQuery();

  const handleBatchCreated = useCallback(
    (batchId: EntityId) => {
      setUrlQuery({ batchId });
    },
    [setUrlQuery],
  );

  const header = (
    <SidebarHeader bgImage={giftingFlowImage} onClose={onClose}>
      {isFulfilled ? (
        <Typography sx={styles.header}>{campaign ? `Send Gift(s) from the ${campaign.name}` : ''}</Typography>
      ) : (
        <Skeleton sx={styles.skeleton} width={300} height={20} />
      )}
    </SidebarHeader>
  );

  return (
    <GiftingFlow.GiftingFlowProvider
      campaignId={campaignId}
      batchId={batchIdFromUrl}
      onBatchCreated={handleBatchCreated}
      vidyardClientId={window.APP_CONFIG.vidyardClientId}
    >
      <GiftingFlow.Stepper activeStep={step ?? ''} header={header}>
        <GiftingFlow.StepperContainer name={GiftingFlow.GiftingFlowStep.Contacts}>
          <ContactsStep />
        </GiftingFlow.StepperContainer>
        <GiftingFlow.StepperContainer scrollable={false} name={GiftingFlow.GiftingFlowStep.Gift}>
          <SelectGiftStep />
        </GiftingFlow.StepperContainer>
        <GiftingFlow.StepperContainer name={GiftingFlow.GiftingFlowStep.Messaging}>
          <MessagingStep />
        </GiftingFlow.StepperContainer>
        <GiftingFlow.StepperContainer name={GiftingFlow.GiftingFlowStep.Send}>
          <SendingStep />
        </GiftingFlow.StepperContainer>
      </GiftingFlow.Stepper>
    </GiftingFlow.GiftingFlowProvider>
  );
};

export default memo<IGiftingFlowModuleProps>(GiftingFlowModule);
