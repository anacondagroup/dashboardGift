import * as R from 'ramda';

import {
  SS_BUDGET_STEP,
  SS_CARD_ORDER_REVIEW_STEP,
  SS_MARKETPLACE_STEP,
  SS_REQUIRED_ACTIONS_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../constants/swagSelect.constants';

export const mapCampaignToSwagSelectFlow = (steps, campaign) =>
  Object.keys(steps).reduce((acc, next) => {
    acc[next] = { ...steps[next] };

    if (campaign[next]) {
      switch (next) {
        case 'owner':
          acc[next].data = {
            team: campaign.team,
            owner: campaign.owner,
          };
          break;
        case SS_CARD_ORDER_REVIEW_STEP:
          if (campaign[SS_CARD_ORDER_REVIEW_STEP]) {
            acc[next].data = {
              ...campaign[SS_CARD_ORDER_REVIEW_STEP],
              isConfirmed: false,
            };
          }
          break;
        default:
          acc[next].data = typeof campaign[next] === 'string' ? { [next]: campaign[next] } : { ...campaign[next] };
      }
    }
    return acc;
  }, {});

const isCompleted = (data, step) => {
  if (step === SS_BUDGET_STEP) {
    return !!data.exchangeOption;
  }
  if (step === SS_MARKETPLACE_STEP) {
    return !!data.defaultProductId;
  }
  if (step === SS_CARD_ORDER_REVIEW_STEP) {
    return data.isConfirmed;
  }
  if (step === SS_REQUIRED_ACTIONS_STEP) {
    return Object.keys(data).length > 0;
  }
  return !!R.pipe(R.values, R.filter(Boolean), R.length)(data);
};

export const calculateStepsStatuses = (steps, findActive = false) => {
  const newSteps = R.clone(steps);
  const stepKeys = Object.keys(steps);
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const currentStepName of stepKeys) {
    const isStepCompleted = isCompleted(steps[currentStepName].data, currentStepName);
    if (isStepCompleted) {
      newSteps[currentStepName].status = SWAG_SELECT_FLOW_STATES.COMPLETED;
    } else {
      newSteps[currentStepName].status = SWAG_SELECT_FLOW_STATES.UNTOUCHED;
    }
  }
  if (findActive) {
    let lastUntouched = '';
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const currentStepName of stepKeys.reverse()) {
      if (newSteps[currentStepName].status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
        lastUntouched = currentStepName;
      }
      if (
        lastUntouched &&
        newSteps[lastUntouched].status &&
        newSteps[currentStepName].status === SWAG_SELECT_FLOW_STATES.COMPLETED
      ) {
        newSteps[lastUntouched].status = SWAG_SELECT_FLOW_STATES.ACTIVE;
        break;
      }
    }
  }
  return newSteps;
};
