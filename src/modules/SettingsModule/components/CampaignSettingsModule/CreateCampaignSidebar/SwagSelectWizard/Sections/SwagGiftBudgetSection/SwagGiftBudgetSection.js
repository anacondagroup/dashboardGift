import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Button as AlyceButton } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import {
  swagSelectChangeStep,
  swagSelectSetStepData,
  swagSelectUpdateCampaignBudgetRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import { SS_BUDGET_STEP, SS_MARKETPLACE_STEP } from '../../../../../../../../constants/swagSelect.constants';
import { getSwagSelectCampaignOwnershipData } from '../../../../../../store/campaign/swagSelect/swagSelect.selectors';

import SwagGiftBudgetForm from './SwagGiftBudgetForm';

const SwagGiftBudgetSection = ({ data, isLoading, campaignId, onBack }) => {
  const dispatch = useDispatch();

  const { teamId } = useSelector(getSwagSelectCampaignOwnershipData);

  const onSubmit = useCallback(
    ({ formValues, isDirty }) => {
      if (!isDirty) {
        dispatch(
          swagSelectChangeStep({
            next: SS_MARKETPLACE_STEP,
          }),
        );
        return;
      }
      dispatch(
        swagSelectSetStepData({
          step: SS_BUDGET_STEP,
          data: formValues,
        }),
      );
      dispatch(swagSelectUpdateCampaignBudgetRequest(campaignId));
    },
    [dispatch, campaignId],
  );

  return (
    <Box px={3}>
      {!!onBack && (
        <Box mx={-3} pb={2}>
          <AlyceButton disableRipple onClick={onBack} variant="text">
            &lt; back
          </AlyceButton>
        </Box>
      )}
      <SwagGiftBudgetForm onSubmit={onSubmit} teamId={teamId} isLoading={isLoading} defaultValues={data} />
    </Box>
  );
};

SwagGiftBudgetSection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.number,
  onBack: PropTypes.func,
};

SwagGiftBudgetSection.defaultProps = {
  data: {},
  campaignId: undefined,
  onBack: undefined,
};

export default SwagGiftBudgetSection;
