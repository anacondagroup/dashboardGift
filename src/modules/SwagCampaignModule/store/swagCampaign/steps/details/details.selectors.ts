import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { TDetailsState } from './details.reducer';

const getDetailsState = (state: IRootState): TDetailsState => state.swagCampaign.steps.details;

export const getDetailsErrors = pipe(getDetailsState, prop('errors'));
export const getDetailsData = pipe(getDetailsState, prop('data'));

const getDetailsStatus = pipe(getDetailsState, prop('status'));
export const getIsDetailsPending = pipe(getDetailsStatus, equals(StateStatus.Pending));
export const getIsDetailsFulfilled = pipe(getDetailsStatus, equals(StateStatus.Fulfilled));
export const getIsDetailsRejected = pipe(getDetailsStatus, equals(StateStatus.Rejected));
export const getIsDetailsIdle = pipe(getDetailsStatus, equals(StateStatus.Idle));
