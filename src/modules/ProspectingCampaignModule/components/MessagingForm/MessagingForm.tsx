import React, { ReactNode, useEffect } from 'react';
import { Box } from '@mui/material';
import { Control, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { clone } from 'ramda';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { CommonData } from '@alycecom/modules';

import {
  messagingFormDefaultValues,
  messagingFormResolver,
} from '../../store/prospectingCampaign/steps/messaging/messaging.schemas';
import { SectionTitle } from '../styled/Styled';
import { TProspectingMessaging } from '../../store/prospectingCampaign/prospectingCampaign.types';
import {
  getMessagingData,
  getMessagingErrors,
} from '../../store/prospectingCampaign/steps/messaging/messaging.selectors';

import MessageDataController from './controllers/MessageDataController/MessageDataController';
import VideoDataController from './controllers/VideoDataController/VideoDataController';
import RedemptionDataController from './controllers/RedemptionDataController/RedemptionDataController';

export interface IMessagingFormChildProps {
  isDirty: boolean;
}

export interface IMessagingFormProps {
  children: ReactNode | ((arg0: IMessagingFormChildProps) => ReactNode);
  onSubmit: (values: TProspectingMessaging, isDirty: boolean) => void;
}

const MessagingForm = ({ children, onSubmit }: IMessagingFormProps): JSX.Element => {
  const messagingData = useSelector(getMessagingData);
  const messagingErrors = useSelector(getMessagingErrors);
  const bodyCharsLimit = useSelector(CommonData.selectors.getEmailCharLimit);

  const {
    handleSubmit,
    control,
    reset,
    setError,
    trigger,
    formState: { isDirty },
  } = useForm({
    mode: 'all',
    resolver: messagingFormResolver,
    defaultValues: messagingFormDefaultValues,
    context: {
      bodyCharsLimit,
    },
  });

  const submitHandler = (values: TProspectingMessaging) => {
    onSubmit(values, isDirty);
  };

  useEffect(() => {
    if (messagingData) {
      reset(clone(messagingData), { keepDefaultValues: false });
    }
  }, [messagingData, reset]);

  useApplyManualFormErrorsEffect<TProspectingMessaging>(setError, messagingErrors);

  return (
    <Box component="form" display="flex" flexDirection="column" onSubmit={handleSubmit(submitHandler)}>
      <Box flex="1 1 auto" mb={20}>
        <Box mb={3}>
          <SectionTitle>Messaging Templates</SectionTitle>
        </Box>
        <Box maxWidth={580}>
          <MessageDataController control={control as Control<TProspectingMessaging>} trigger={trigger} />
        </Box>
        <Box mt={8} mb={3}>
          <SectionTitle>Video Content</SectionTitle>
        </Box>
        <Box maxWidth={640}>
          <VideoDataController control={control as Control<TProspectingMessaging>} />
        </Box>
        <Box mt={8} mb={3}>
          <SectionTitle>Post-Gift Redirect</SectionTitle>
        </Box>
        <Box maxWidth={580}>
          <RedemptionDataController control={control as Control<TProspectingMessaging>} />
        </Box>
      </Box>
      {typeof children === 'function' ? children({ isDirty }) : children}
    </Box>
  );
};

export default MessagingForm;
