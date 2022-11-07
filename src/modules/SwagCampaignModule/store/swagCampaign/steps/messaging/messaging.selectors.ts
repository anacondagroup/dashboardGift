import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { TMessagingState } from './messaging.reducer';

const getMessagingState = (state: IRootState): TMessagingState => state.swagCampaign.steps.messaging;

export const getMessagingData = pipe(getMessagingState, prop('data'));
export const getMessagingErrors = pipe(getMessagingState, prop('errors'));

const getMessagingStatus = pipe(getMessagingState, prop('status'));
export const getIsMessagingIdle = pipe(getMessagingStatus, equals(StateStatus.Idle));
export const getIsMessagingPending = pipe(getMessagingStatus, equals(StateStatus.Pending));
export const getIsMessagingFulfilled = pipe(getMessagingStatus, equals(StateStatus.Fulfilled));
