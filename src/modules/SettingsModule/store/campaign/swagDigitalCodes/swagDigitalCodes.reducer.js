import { clone } from 'ramda';

import {
  GENERATE_SWAG_DIGITAL_FLOW,
  GENERATE_SWAG_DIGITAL_STATES,
  GSD_STEP_2,
} from '../../../../../constants/swagDigital.constants';
import { CREATE_CAMPAIGN_SIDEBAR_CLOSE } from '../createCampaignSidebar/createCampaignSidebar.types';

import {
  SWAG_DIGITAL_CODES_CHANGE_STEP,
  SWAG_DIGITAL_CODES_GENERATE_FLOW_WIZARD_REQUEST,
  SWAG_DIGITAL_CODES_SET_STEP_DATA,
  SWAG_DIGITAL_GENERATE_CODES_FAIL,
  SWAG_DIGITAL_GENERATE_CODES_REQUEST,
  SWAG_DIGITAL_GENERATE_CODES_SUCCESS,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_SUCCESS,
} from './swagDigitalCodes.types';

const initialState = {
  campaignId: undefined,
  teamId: undefined,
  steps: {},
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SWAG_DIGITAL_CODES_GENERATE_FLOW_WIZARD_REQUEST:
      return {
        ...state,
        steps: clone(GENERATE_SWAG_DIGITAL_FLOW),
        campaignId: payload.campaignId,
        teamId: payload.teamId,
      };
    case SWAG_DIGITAL_CODES_SET_STEP_DATA: {
      const { step, data } = action.payload;
      return {
        ...state,
        steps: {
          ...state.steps,
          [step]: {
            ...state.steps[step],
            data,
          },
        },
      };
    }
    case SWAG_DIGITAL_CODES_CHANGE_STEP: {
      const { current, next, data } = action.payload;
      return {
        ...state,
        steps: {
          ...state.steps,
          [current]: {
            ...state.steps[current],
            status: GENERATE_SWAG_DIGITAL_STATES.COMPLETED,
            data,
          },
          [next]: {
            ...state.steps[next],
            status: GENERATE_SWAG_DIGITAL_STATES.ACTIVE,
          },
        },
      };
    }
    case SWAG_DIGITAL_GENERATE_CODES_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSD_STEP_2]: {
            ...state.steps[GSD_STEP_2],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_DIGITAL_GENERATE_CODES_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSD_STEP_2]: {
            ...state.steps[GSD_STEP_2],
            isLoading: false,
            data: {
              ...state.steps[GSD_STEP_2].data,
              codesCreationRequestId: action.payload,
            },
          },
        },
      };
    }
    case SWAG_DIGITAL_GENERATE_CODES_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSD_STEP_2]: {
            ...state.steps[GSD_STEP_2],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_DIGITAL_GENERATION_CODES_PROGRESS_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSD_STEP_2]: {
            ...state.steps[GSD_STEP_2],
            data: {
              ...state.steps[GSD_STEP_2].data,
              ...action.payload,
            },
          },
        },
      };
    }
    case CREATE_CAMPAIGN_SIDEBAR_CLOSE:
      return { ...initialState };
    default:
      return {
        ...state,
      };
  }
};
