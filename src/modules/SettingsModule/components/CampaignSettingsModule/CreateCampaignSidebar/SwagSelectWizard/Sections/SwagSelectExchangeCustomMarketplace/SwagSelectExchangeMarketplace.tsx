import React, { useCallback, useMemo } from 'react';
import { Button as AlyceButton } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import {
  getSwagSelectCampaignBudgetData,
  getSwagSelectCampaignId,
  getSwagSelectCampaignOwnershipData,
} from '../../../../../../store/campaign/swagSelect/swagSelect.selectors';
import {
  swagSelectChangeStep,
  swagSelectSetStepData,
  swagSelectUpdateCampaignBudgetRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import {
  ExchangeOptions,
  SS_BUDGET_STEP,
  SS_MARKETPLACE_STEP,
} from '../../../../../../../../constants/swagSelect.constants';

import SwagSelectCustomMarketplaceForm from './SwagSelectCustomMarketplaceForm';

export interface ISwagSelectExchangeMarketplaceProps {
  onBack: () => void;
}

const SwagSelectExchangeMarketplace = ({ onBack }: ISwagSelectExchangeMarketplaceProps): JSX.Element => {
  const dispatch = useDispatch();
  const { customMarketplaceId } = useSelector(getSwagSelectCampaignBudgetData);
  const { teamId } = useSelector(getSwagSelectCampaignOwnershipData);
  const campaignId = useSelector(getSwagSelectCampaignId);

  const handleSubmit = useCallback(
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
          data: {
            ...formValues,
            exchangeOption: ExchangeOptions.CustomMarketplace,
          },
        }),
      );
      dispatch(swagSelectUpdateCampaignBudgetRequest(campaignId));
    },
    [dispatch, campaignId],
  );

  return (
    <Box px={3}>
      <Box mx={-3} pb={2}>
        <AlyceButton onClick={onBack} variant="text">
          &lt; back
        </AlyceButton>
      </Box>
      <SwagSelectCustomMarketplaceForm
        defaultValues={useMemo(() => ({ customMarketplaceId }), [customMarketplaceId])}
        onSubmit={handleSubmit}
        teamId={teamId}
      />
    </Box>
  );
};

export default SwagSelectExchangeMarketplace;
