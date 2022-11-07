import { clone } from 'ramda';

import {
  GENERATE_SWAG_PHYSICAL_CARDS_FLOW,
  GSP_STEP_2,
  GSP_STEP_3,
} from '../../../../../constants/swagPhysical.constants';
import { CREATE_CAMPAIGN_SIDEBAR_CLOSE } from '../createCampaignSidebar/createCampaignSidebar.types';
import { GENERATE_SWAG_DIGITAL_STATES } from '../../../../../constants/swagDigital.constants';
import { calculateStepsStatuses } from '../swagSelect/swagSelect.helpers';

import {
  SWAG_PHYSICAL_CODES_GENERATE_FLOW_WIZARD_REQUEST,
  SWAG_PHYSICAL_CODES_SET_STEP_DATA,
  SWAG_PHYSICAL_CODES_CHANGE_STEP,
  SWAG_PHYSICAL_CAMPAIGN_DATA_REQUEST,
  SWAG_PHYSICAL_CAMPAIGN_DATA_SUCCESS,
  SWAG_PHYSICAL_CAMPAIGN_DATA_FAIL,
  SWAG_PHYSICAL_GENERATE_CODES_REQUEST,
  SWAG_PHYSICAL_GENERATE_CODES_SUCCESS,
  SWAG_PHYSICAL_GENERATE_CODES_FAIL,
} from './swagPhysicalCodes.types';

const initialState = {
  campaignId: undefined,
  teamId: undefined,
  frontPreview: undefined,
  backPreview: undefined,
  steps: {},
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SWAG_PHYSICAL_CODES_GENERATE_FLOW_WIZARD_REQUEST:
      return {
        ...state,
        steps: clone(GENERATE_SWAG_PHYSICAL_CARDS_FLOW),
        campaignId: payload.campaignId,
        teamId: payload.teamId,
      };
    case SWAG_PHYSICAL_CODES_SET_STEP_DATA: {
      const { step, data } = payload;
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
    case SWAG_PHYSICAL_CODES_CHANGE_STEP: {
      const { current, next, data } = payload;

      if (current && next) {
        return {
          ...state,
          steps: {
            ...state.steps,
            [current]: {
              ...state.steps[current],
              data,
              status: GENERATE_SWAG_DIGITAL_STATES.COMPLETED,
            },
            [next]: {
              ...state.steps[next],
              status: GENERATE_SWAG_DIGITAL_STATES.ACTIVE,
            },
          },
        };
      }

      if (current && !next) {
        return {
          ...state,
          steps: {
            ...state.steps,
            [current]: {
              ...state.steps[current],
              data,
              status: GENERATE_SWAG_DIGITAL_STATES.COMPLETED,
            },
          },
        };
      }

      if (!current && next) {
        const updatedSteps = calculateStepsStatuses(state.steps);
        updatedSteps[next].status = GENERATE_SWAG_DIGITAL_STATES.ACTIVE;
        return {
          ...state,
          steps: updatedSteps,
        };
      }

      return {
        ...state,
      };
    }
    case SWAG_PHYSICAL_CAMPAIGN_DATA_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSP_STEP_2]: {
            ...state.steps[GSP_STEP_2],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_PHYSICAL_CAMPAIGN_DATA_SUCCESS: {
      return {
        ...state,
        frontPreview: payload.physicalCardFrontSide,
        backPreview: payload.physicalCardBackSide,
        steps: {
          ...state.steps,
          [GSP_STEP_2]: {
            ...state.steps[GSP_STEP_2],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_PHYSICAL_CAMPAIGN_DATA_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSP_STEP_2]: {
            ...state.steps[GSP_STEP_2],
            isLoading: false,
          },
        },
      };
    }
    case CREATE_CAMPAIGN_SIDEBAR_CLOSE:
      return { ...initialState };
    case SWAG_PHYSICAL_GENERATE_CODES_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSP_STEP_3]: {
            ...state.steps[GSP_STEP_3],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_PHYSICAL_GENERATE_CODES_SUCCESS:
    case SWAG_PHYSICAL_GENERATE_CODES_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [GSP_STEP_3]: {
            ...state.steps[GSP_STEP_3],
            isLoading: false,
          },
        },
      };
    }
    default:
      return state;
  }
};
