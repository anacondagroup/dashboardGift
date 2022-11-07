import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Control, useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { clone } from 'ramda';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { CommonData, SectionTitleStyled } from '@alycecom/modules';

import { TSwagMessaging } from '../../store/swagCampaign/swagCampaign.types';
import {
  messagingFormDefaultValues,
  messagingFormResolver,
} from '../../store/swagCampaign/steps/messaging/messaging.schemas';
import { getMessagingData, getMessagingErrors } from '../../store/swagCampaign/steps/messaging/messaging.selectors';

import MessageDataController from './MessageDataController/MessageDataController';

export interface IMessagingFormChildProps {
  isDirty: boolean;
}

export interface IMessagingFormProps {
  children: ReactNode | ((arg0: IMessagingFormChildProps) => ReactNode);
  onSubmit: (values: TSwagMessaging, isDirty: boolean) => void;
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

  const submitHandler = (values: TSwagMessaging) => {
    onSubmit(values, isDirty);
  };

  useEffect(() => {
    if (messagingData) {
      reset(clone(messagingData), { keepDefaultValues: false });
    }
  }, [messagingData, reset]);

  useApplyManualFormErrorsEffect<TSwagMessaging>(setError, messagingErrors);

  return (
    <Box component="form" display="flex" flexDirection="column" onSubmit={handleSubmit(submitHandler)}>
      <Box flex="1 1 auto" mb={20}>
        <Box mb={3}>
          <SectionTitleStyled>Gift Redemption Page</SectionTitleStyled>
        </Box>
        <Box maxWidth={580}>
          <MessageDataController control={control as Control<TSwagMessaging>} trigger={trigger} />
        </Box>
      </Box>
      {typeof children === 'function' ? children({ isDirty }) : children}
    </Box>
  );
};

export default MessagingForm;
