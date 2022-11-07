import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { User } from '@alycecom/modules';
import { EntityId } from '@reduxjs/toolkit';
import { TrackEvent } from '@alycecom/services';

import {
  trackCampaignBuilderNextButtonClicked,
  trackCampaignEditorCopyButtonClicked,
  trackCampaignEditorSaveButtonClicked,
} from '../events';
import { TUpdateDetailsFormValues } from '../store/steps/details/detailsForm.schemas';
import { IActivateDraftGift } from '../store';
import { IActivateMessaging } from '../store/steps/messaging/messaging.types';
import { ActivateBuilderStep } from '../routePaths';

export const useTrackCampaignBuilderNextButtonClicked = (
  step: ActivateBuilderStep,
): ((campaignId: number, formValues?: Record<string, unknown>) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(
    (campaignId: number, formValues?: Record<string, unknown>) => {
      dispatch(trackCampaignBuilderNextButtonClicked(step, { ...payload, campaignId, formValues }, options));
    },
    [dispatch, payload, options, step],
  );
};

export const useTrackCampaignEditorSaveButtonClicked = (
  step: ActivateBuilderStep,
): ((campaignId: number, formValues?: TUpdateDetailsFormValues | IActivateDraftGift | IActivateMessaging) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(
    (campaignId: number, formValues?: TUpdateDetailsFormValues | IActivateDraftGift | IActivateMessaging) => {
      dispatch(trackCampaignEditorSaveButtonClicked(step, { ...payload, campaignId, formValues }, options));
    },
    [dispatch, payload, options, step],
  );
};

export const useTrackCampaignBuilderCopyButtonClicked = (): ((campaignId: number | undefined) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(
    (campaignId: number | undefined) => {
      dispatch(trackCampaignEditorCopyButtonClicked({ ...payload, campaignId: campaignId || null }, options));
    },
    [dispatch, payload, options],
  );
};

export const useTrackCampaignEditorUnexpireClicked = ({ campaignId }: { campaignId: EntityId }): (() => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(() => {
    dispatch(
      TrackEvent.actions.trackEvent({
        name: `1:many Gift links — unexpired`,
        payload: { ...payload, campaignId },
        options,
      }),
    );
  }, [dispatch, payload, campaignId, options]);
};

export const useTrackCampaignFreeClaimsUpdated = ({
  campaignId,
}: {
  campaignId: EntityId;
}): ((arg0: { prevClaims?: number | null; nextClaims: number }) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(
    ({ prevClaims, nextClaims }) => {
      dispatch(
        TrackEvent.actions.trackEvent({
          name: `1:many Total claims — updated`,
          payload: { ...payload, campaignId, prevClaims, nextClaims },
          options,
        }),
      );
    },
    [dispatch, payload, campaignId, options],
  );
};
