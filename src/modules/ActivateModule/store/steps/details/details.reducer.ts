import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';
import { CampaignStatus } from '@alycecom/services';

import { clearActivateModuleState, loadActivateSuccess } from '../../activate.actions';
import { IActivateDetails, isFullActivate } from '../../activate.types';
import { unExpireActivateOrSwagCampaigns } from '../../../../DashboardModule/store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.actions';
import { ActivateCampaignRoutes } from '../../../routePaths';

import {
  createActivateDraftFail,
  createActivateDraftRequest,
  createActivateDraftSuccess,
  updateDetailsFail,
  updateDetailsRequest,
  updateDetailsSuccess,
  updateFreeClaims,
} from './details.actions';

export interface IDetailsState {
  status: StateStatus;
  data?: IActivateDetails;
  campaignLink?: string;
}

export const initialDetailsState: IDetailsState = {
  status: StateStatus.Idle,
  data: undefined,
  campaignLink: undefined,
};

export const details = createReducer({}, initialDetailsState);

details.on(loadActivateSuccess, (state, payload) => ({
  ...state,
  data: payload.details,
  campaignLink: isFullActivate(payload) ? payload.campaignLink : undefined,
}));

details.on(clearActivateModuleState, () => ({
  ...initialDetailsState,
}));

details.on(createActivateDraftRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));

details.on(createActivateDraftSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: payload,
}));

details.on(createActivateDraftFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

details.on(updateDetailsRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));

details.on(updateDetailsSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    ...(state.data as IActivateDetails),
    ...payload,
  },
}));

details.on(updateDetailsFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

details.on(updateFreeClaims.fulfilled, (state, payload) => ({
  ...state,
  data: {
    ...(state.data as IActivateDetails),
    freeClaims: payload.freeClaims,
  },
}));

details
  .on(unExpireActivateOrSwagCampaigns.pending, (state, payload) => {
    const id = ActivateCampaignRoutes.matchBasePath(window.location.pathname)?.campaignId;

    if (id && payload.campaignIds.includes(id) && state.data) {
      return {
        ...state,
        status: StateStatus.Pending,
      };
    }

    return state;
  })
  .on(unExpireActivateOrSwagCampaigns.fulfilled, (state, payload) => {
    const id = ActivateCampaignRoutes.matchBasePath(window.location.pathname)?.campaignId;

    if (id && payload.campaignIds.includes(id) && state.data) {
      return {
        ...state,
        status: StateStatus.Fulfilled,
        data: {
          ...state.data,
          status: CampaignStatus.Active,
        },
      };
    }

    return state;
  })
  .on(unExpireActivateOrSwagCampaigns.rejected, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }));
