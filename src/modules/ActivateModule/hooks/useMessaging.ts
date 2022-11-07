import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import { getIsMessagingLoading, getMessagingData } from '../store/steps/messaging/messaging.selectors';
import { messagingStepRequest } from '../store/steps/messaging/messaging.actions';
import { IVideoData, VideoDataTypes } from '../store/steps/messaging/messaging.types';
import { IMessageFormValues, MessagingFormFields } from '../store/steps/messaging/messagingForm.schemas';
import { getActivateModuleParams } from '../store/activate.selectors';
import { ActivateBuilderStep, ActivateModes } from '../routePaths';

import { useTrackCampaignBuilderNextButtonClicked, useTrackCampaignEditorSaveButtonClicked } from './useTrackActivate';

interface IMessageStepAdapter {
  saveStep: (formValues: IMessageFormValues, options: { openLinkOnSuccess: string } | void) => void;
  isLoading: boolean;
  data?: IMessageFormValues;
}

export const useMessaging = (campaignId: number | null): IMessageStepAdapter => {
  const dispatch = useDispatch();
  const { mode } = useSelector(getActivateModuleParams);
  const trackNextButtonClicked = useTrackCampaignBuilderNextButtonClicked(ActivateBuilderStep.Messaging);
  const trackCampaignEditorSaveButtonClicked = useTrackCampaignEditorSaveButtonClicked(ActivateBuilderStep.Messaging);

  const data = useSelector(getMessagingData);
  const isLoading = useSelector(getIsMessagingLoading);

  const saveStep = useCallback(
    (formValues: IMessageFormValues, options: { openLinkOnSuccess: string } | void) => {
      let videoData: IVideoData | null = null;

      if (formValues[MessagingFormFields.EmbedVideoUrl]) {
        videoData = {
          url: formValues[MessagingFormFields.EmbedVideoUrl],
          type: VideoDataTypes.Embed,
          vidyardImage: null,
          vidyardVideo: null,
        };
      }

      if (formValues.vidyard) {
        videoData = {
          url: null,
          type: VideoDataTypes.Vidyard,
          vidyardImage: formValues.vidyard.vidyardImage,
          vidyardVideo: formValues.vidyard.vidyardVideo,
        };
      }

      const messagingData = {
        pageHeader: formValues[MessagingFormFields.PageHeader],
        pageBody: formValues[MessagingFormFields.PageBody],
        postGiftAction: formValues[MessagingFormFields.PostGiftAction],
        postGiftRedirect: formValues[MessagingFormFields.PostGiftRedirect],
        showGiftRedemptionPopUp: formValues[MessagingFormFields.ShowGiftRedemptionPopUp],
        redemptionPopUp: formValues[MessagingFormFields.RedemptionPopUp],
        expirePopUp: formValues[MessagingFormFields.ExpirePopup],
        recipientMeta: formValues[MessagingFormFields.RecipientMeta],
        videoData,
      };

      if (campaignId) {
        if (mode === ActivateModes.Builder) {
          trackNextButtonClicked(campaignId, messagingData);
        } else {
          trackCampaignEditorSaveButtonClicked(campaignId, messagingData);
        }

        dispatch(
          messagingStepRequest({
            data: messagingData,
            options,
          }),
        );
      }
    },
    [dispatch, campaignId, trackNextButtonClicked, trackCampaignEditorSaveButtonClicked, mode],
  );

  return {
    saveStep,
    isLoading,
    data,
  };
};
