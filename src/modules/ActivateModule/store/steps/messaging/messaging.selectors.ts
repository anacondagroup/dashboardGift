import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { IMessagingState } from './messaging.reducer';
import { IActivateMessagingStep } from './messaging.types';
import { IMessageFormValues, MessagingFormFields } from './messagingForm.schemas';

export const getMessagingStep = (state: IRootState): IMessagingState => state.activate.steps.messaging;

const mapForForm = (message?: IActivateMessagingStep): IMessageFormValues | undefined => {
  if (message && message.pageHeader) {
    const vidyard =
      message && message.videoData
        ? { vidyardVideo: message.videoData.vidyardVideo, vidyardImage: message.videoData.vidyardImage }
        : null;

    return {
      pageHeader: message.pageHeader,
      pageBody: message.pageBody,
      postGiftAction: message.postGiftAction,
      postGiftRedirect: message.postGiftRedirect,
      showGiftRedemptionPopUp: message.showGiftRedemptionPopUp,
      redemptionPopUp: message.redemptionPopUp,
      embedVideoUrl: message.videoData?.url || null,
      landingPageContentType: message.landingPageContentType,
      [MessagingFormFields.ExpirePopup]: message[MessagingFormFields.ExpirePopup],
      [MessagingFormFields.RecipientMeta]: message[MessagingFormFields.RecipientMeta],
      vidyard,
    };
  }
  return undefined;
};

export const getMessagingData = pipe(getMessagingStep, state => mapForForm(state.data));

export const getIsMessagingLoading = pipe(getMessagingStep, state => state.status === StateStatus.Pending);
