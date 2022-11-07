import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState, loadActivateSuccess } from '../../activate.actions';

import { messagingStepFail, messagingStepRequest, messagingStepSuccess } from './messaging.actions';
import { IActivateMessagingStep, LandingPageContents } from './messaging.types';

export interface IMessagingState {
  status: StateStatus;
  data?: IActivateMessagingStep;
}

export const initialMessagingState: IMessagingState = {
  status: StateStatus.Idle,
  data: undefined,
};

const messagingReducer = createReducer({}, initialMessagingState);

messagingReducer.on(loadActivateSuccess, (state, payload) => {
  let landingPageContentType: LandingPageContents = LandingPageContents.Text;
  if (payload.messaging && payload.messaging.videoData) {
    if (payload.messaging.videoData.type === 'embed') {
      landingPageContentType = LandingPageContents.EmbedVideo;
    } else if (payload.messaging.videoData.type === 'vidyard') {
      landingPageContentType = LandingPageContents.Vidyard;
    }
  }
  return {
    ...state,
    data: {
      ...payload.messaging,
      landingPageContentType,
    },
  };
});

messagingReducer.on(clearActivateModuleState, () => ({
  ...initialMessagingState,
}));

messagingReducer.on(messagingStepRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));

messagingReducer.on(messagingStepSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    ...payload,
    landingPageContentType: payload.pageBody ? LandingPageContents.Text : LandingPageContents.EmbedVideo,
  },
}));

messagingReducer.on(messagingStepFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

export default messagingReducer;
