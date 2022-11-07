import { clone, mergeRight, mergeDeepLeft } from 'ramda';

import {
  SS_CAMPAIGN_NAME_STEP,
  SS_OWNERSHIP_STEP,
  SS_BUDGET_STEP,
  SS_MARKETPLACE_STEP,
  SS_LANDING_PAGE_STEP,
  SS_REQUIRED_ACTIONS_STEP,
  SS_GENERATE_CODES_STEP,
  SWAG_SELECT_FLOW,
  SWAG_SELECT_FLOW_STATES,
  ENDING_SWAG_SELECT_PHYSICAL,
  ENDING_SWAG_SELECT_DIGITAL,
  SS_CARD_CONFIGURATOR_STEP,
  SS_CARD_ORDER_OPTIONS_STEP,
  SS_CARD_ORDER_REVIEW_STEP,
} from '../../../../../constants/swagSelect.constants';

import {
  SWAG_SELECT_CHANGE_STEP,
  SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR,
  SWAG_SELECT_GENERATE_CODES_FAIL,
  SWAG_SELECT_GENERATE_CODES_REQUEST,
  SWAG_SELECT_GENERATE_CODES_SUCCESS,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_SUCCESS,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_FAIL,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_REQUEST,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_SUCCESS,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_FAIL,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_REQUEST,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_SUCCESS,
  SWAG_SELECT_SET_CAMPAIGN_TYPE,
  SWAG_SELECT_SET_STEP_DATA,
  SWAG_SELECT_SKIP_STEP,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_SUCCESS,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_FAIL,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_REQUEST,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_SUCCESS,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_FAIL,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_REQUEST,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_SUCCESS,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_FAIL,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_REQUEST,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_SUCCESS,
  SWAG_SELECT_WIZARD_INIT,
} from './swagSelect.types';
import { mapCampaignToSwagSelectFlow, calculateStepsStatuses } from './swagSelect.helpers';

const initialState = {
  campaignId: undefined,
  steps: {},
  isLoading: false,
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SWAG_SELECT_WIZARD_INIT: {
      if (action.payload === undefined) {
        return {
          steps: clone(SWAG_SELECT_FLOW),
          isLoading: false,
        };
      }
      const { campaignType } = action.payload;
      const flow = mergeRight(
        SWAG_SELECT_FLOW,
        campaignType.includes('physical') ? ENDING_SWAG_SELECT_PHYSICAL : ENDING_SWAG_SELECT_DIGITAL,
      );

      const mappedSteps = mapCampaignToSwagSelectFlow(clone(flow), action.payload);
      const stepsWithActualStatuses = calculateStepsStatuses(mappedSteps, true);

      return {
        campaignId: action.payload.id,
        steps: stepsWithActualStatuses,
      };
    }
    case SWAG_SELECT_SKIP_STEP: {
      const { current, next } = action.payload;
      return {
        ...state,
        steps: {
          ...state.steps,
          [current]: {
            ...state.steps[current],
            status: SWAG_SELECT_FLOW_STATES.SKIPPED,
          },
          [next]: {
            ...state.steps[next],
            status: SWAG_SELECT_FLOW_STATES.ACTIVE,
          },
        },
      };
    }
    case SWAG_SELECT_SET_STEP_DATA: {
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
    case SWAG_SELECT_CHANGE_STEP: {
      const { current, next, data } = action.payload;
      if (current && next) {
        return {
          ...state,
          steps: {
            ...state.steps,
            [current]: {
              ...state.steps[current],
              status: SWAG_SELECT_FLOW_STATES.COMPLETED,
              data,
            },
            [next]: {
              ...state.steps[next],
              status: SWAG_SELECT_FLOW_STATES.ACTIVE,
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
              status: SWAG_SELECT_FLOW_STATES.COMPLETED,
              data,
            },
          },
        };
      }

      if (!current && next) {
        const updatedSteps = calculateStepsStatuses(state.steps);
        updatedSteps[next].status = SWAG_SELECT_FLOW_STATES.ACTIVE;
        return {
          ...state,
          steps: updatedSteps,
        };
      }

      return {
        ...state,
      };
    }
    case SWAG_SELECT_SET_CAMPAIGN_TYPE: {
      const flowEnding = action.payload === 'Physical' ? ENDING_SWAG_SELECT_PHYSICAL : ENDING_SWAG_SELECT_DIGITAL;
      const flow = { ...SWAG_SELECT_FLOW, ...flowEnding };
      return {
        ...state,
        steps: mergeDeepLeft(state.steps, flow),
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_NAME_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CAMPAIGN_NAME_STEP]: {
            ...state.steps[SS_CAMPAIGN_NAME_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_NAME_SUCCESS:
    case SWAG_SELECT_UPDATE_CAMPAIGN_NAME_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CAMPAIGN_NAME_STEP]: {
            ...state.steps[SS_CAMPAIGN_NAME_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_OWNERSHIP_STEP]: {
            ...state.steps[SS_OWNERSHIP_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_OWNERSHIP_STEP]: {
            ...state.steps[SS_OWNERSHIP_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_OWNERSHIP_STEP]: {
            ...state.steps[SS_OWNERSHIP_STEP],
            isLoading: false,
            data: {},
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_BUDGET_STEP]: {
            ...state.steps[SS_BUDGET_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_SUCCESS:
    case SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_BUDGET_STEP]: {
            ...state.steps[SS_BUDGET_STEP],
            isLoading: false,
            data: action.payload?.campaign?.[SS_BUDGET_STEP]
              ? { ...state.steps[SS_BUDGET_STEP].data, ...action.payload.campaign[SS_BUDGET_STEP] }
              : state.steps[SS_BUDGET_STEP].data,
          },
          [SS_MARKETPLACE_STEP]: {
            ...state.steps[SS_MARKETPLACE_STEP],
            data: action.payload?.campaign?.[SS_MARKETPLACE_STEP]
              ? { ...state.steps[SS_MARKETPLACE_STEP].data, ...action.payload.campaign[SS_MARKETPLACE_STEP] }
              : state.steps[SS_MARKETPLACE_STEP].data,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_MARKETPLACE_STEP]: {
            ...state.steps[SS_MARKETPLACE_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_MARKETPLACE_STEP]: {
            ...state.steps[SS_MARKETPLACE_STEP],
            isLoading: false,
            data: {
              ...state.steps[SS_MARKETPLACE_STEP].data,
              ...action.payload.campaign[SS_MARKETPLACE_STEP],
            },
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_FAIL: {
      return {
        ...state,
        steps: {
          ...state.step,
          [SS_MARKETPLACE_STEP]: {
            ...state.step[SS_MARKETPLACE_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_LANDING_PAGE_STEP]: {
            ...state.steps[SS_LANDING_PAGE_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_SUCCESS:
    case SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_LANDING_PAGE_STEP]: {
            ...state.steps[SS_LANDING_PAGE_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_REQUIRED_ACTIONS_STEP]: {
            ...state.steps[SS_REQUIRED_ACTIONS_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_REQUIRED_ACTIONS_STEP]: {
            ...state.steps[SS_REQUIRED_ACTIONS_STEP],
            isLoading: false,
            data: action.payload,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_REQUIRED_ACTIONS_STEP]: {
            ...state.steps[SS_REQUIRED_ACTIONS_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_GENERATE_CODES_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_GENERATE_CODES_STEP]: {
            ...state.steps[SS_GENERATE_CODES_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_GENERATE_CODES_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_GENERATE_CODES_STEP]: {
            ...state.steps[SS_GENERATE_CODES_STEP],
            isLoading: false,
            data: {
              ...state.steps[SS_GENERATE_CODES_STEP].data,
              codesCreationRequestId: action.payload,
            },
          },
        },
      };
    }
    case SWAG_SELECT_GENERATE_CODES_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_GENERATE_CODES_STEP]: {
            ...state.steps[SS_GENERATE_CODES_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_GENERATION_CODES_PROGRESS_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_GENERATE_CODES_STEP]: {
            ...state.steps[SS_GENERATE_CODES_STEP],
            data: {
              ...state.steps[SS_GENERATE_CODES_STEP]?.data,
              ...action.payload,
            },
          },
        },
      };
    }
    case SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR:
      return {
        ...initialState,
      };
    case SWAG_SELECT_SAVE_PHYSICAL_CARD_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_CONFIGURATOR_STEP]: {
            ...state.steps[SS_CARD_CONFIGURATOR_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_SAVE_PHYSICAL_CARD_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_CONFIGURATOR_STEP]: {
            ...state.steps[SS_CARD_CONFIGURATOR_STEP],
            isLoading: false,
            data: action.payload,
          },
        },
      };
    }
    case SWAG_SELECT_SAVE_PHYSICAL_CARD_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_CONFIGURATOR_STEP]: {
            ...state.steps[SS_CARD_CONFIGURATOR_STEP],
            isLoading: false,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_ORDER_OPTIONS_STEP]: {
            ...state.steps[SS_CARD_ORDER_OPTIONS_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_ORDER_OPTIONS_STEP]: {
            ...state.steps[SS_CARD_ORDER_OPTIONS_STEP],
            isLoading: false,
            data: action.payload[SS_CARD_ORDER_OPTIONS_STEP],
          },
          [SS_CARD_ORDER_REVIEW_STEP]: {
            ...state.steps[SS_CARD_ORDER_REVIEW_STEP],
            data: {
              ...state.steps[SS_CARD_ORDER_REVIEW_STEP].data,
              isConfirmed: false,
              ...action.payload[SS_CARD_ORDER_REVIEW_STEP],
            },
          },
        },
      };
    }
    case SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_ORDER_OPTIONS_STEP]: {
            ...state.steps[SS_CARD_ORDER_OPTIONS_STEP],
            isLoading: false,
          },
        },
      };
    }

    case SWAG_SELECT_SEND_ORDER_TO_PROCESSING_REQUEST: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_ORDER_REVIEW_STEP]: {
            ...state.steps[SS_CARD_ORDER_REVIEW_STEP],
            isLoading: true,
          },
        },
      };
    }
    case SWAG_SELECT_SEND_ORDER_TO_PROCESSING_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_ORDER_REVIEW_STEP]: {
            ...state.steps[SS_CARD_ORDER_REVIEW_STEP],
            isLoading: false,
            data: {
              ...state.steps[SS_CARD_ORDER_REVIEW_STEP].data,
              isConfirmed: action.payload,
            },
          },
        },
      };
    }
    case SWAG_SELECT_SEND_ORDER_TO_PROCESSING_FAIL: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [SS_CARD_ORDER_REVIEW_STEP]: {
            ...state.steps[SS_CARD_ORDER_REVIEW_STEP],
            isLoading: false,
          },
        },
      };
    }
    default:
      return state;
  }
};
