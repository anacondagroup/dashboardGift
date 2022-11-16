import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Divider } from '@alycecom/ui';
import { Box } from '@mui/material';

import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  SS_BUDGET_STEP,
  SWAG_SELECT_FLOW_STATES,
  ExchangeOptions,
} from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import { swagSelectChangeStep } from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import SwagGiftBudgetSection from '../SwagGiftBudgetSection/SwagGiftBudgetSection';
import SwagSelectExchangeMarketplace from '../SwagSelectExchangeCustomMarketplace/SwagSelectExchangeMarketplace';
import CustomMarketplaceName from '../../../../../../../MarketplaceModule/components/Shared/CustomMarketplaceName/CustomMarketplaceName';

import ExchangeOption from './ExchangeOption';

const SwagSelectExchangeOption = ({ title, order, status, data, isLoading, campaignId }) => {
  const dispatch = useDispatch();
  const [exchangeOption, setExchangeOption] = useState(data.exchangeOption);
  const handleEdit = useCallback(() => {
    dispatch(swagSelectChangeStep({ current: undefined, next: SS_BUDGET_STEP }));
  }, [dispatch]);

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }
  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    if (data.customMarketplaceId) {
      return (
        <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
          Custom marketplace: <CustomMarketplaceName id={data.customMarketplaceId} />
        </CompletedSection>
      );
    }
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        {[
          typeof data?.minGiftAmount === 'number' && typeof data?.maxGiftAmount === 'number'
            ? `Physical: $${data.minGiftAmount} - $${data.maxGiftAmount}`
            : '',
          typeof data?.donationMaxAmount === 'number' ? `Donation: $${data.donationMaxAmount}` : '',
          typeof data?.giftCardMaxAmount === 'number' ? `Gift Card: $${data.giftCardMaxAmount}` : '',
        ]
          .filter(Boolean)
          .join(', ')}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit} />
    );
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={4} pl="52px" className="H4-Chambray">
        {title}
      </Box>
      {!exchangeOption && (
        <Box mt={1} px={3}>
          <ExchangeOption
            title="Specify Gift Options"
            subtitle="Specify budget, gift types and vendors restrictions"
            onClick={() => setExchangeOption(ExchangeOptions.Budget)}
          />
          <Divider my={2} />
          <ExchangeOption
            title="Choose a Custom Marketplace"
            subtitle="Select an existing marketplace (no need to set amount)"
            onClick={() => setExchangeOption(ExchangeOptions.CustomMarketplace)}
          />
        </Box>
      )}
      {exchangeOption === ExchangeOptions.Budget && (
        <SwagGiftBudgetSection
          isLoading={isLoading}
          data={data}
          campaignId={campaignId}
          onBack={() => setExchangeOption(null)}
        />
      )}
      {exchangeOption === ExchangeOptions.CustomMarketplace && (
        <SwagSelectExchangeMarketplace onBack={() => setExchangeOption(null)} />
      )}
    </Box>
  );
};

SwagSelectExchangeOption.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.number,
};

SwagSelectExchangeOption.defaultProps = {
  data: {},
  campaignId: undefined,
};

export default SwagSelectExchangeOption;
