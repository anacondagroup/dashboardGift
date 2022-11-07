import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import CampaignSidebarSectionWrapper from '../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CampaignSidebarSectionWrapper';
import {
  getSwagSelectCampaignId,
  getSwagSelectCampaignSteps,
} from '../../../../store/campaign/swagSelect/swagSelect.selectors';
import {
  SS_BUDGET_STEP,
  SS_CAMPAIGN_NAME_STEP,
  SS_CAMPAIGN_TYPE_STEP,
  SS_CARD_CONFIGURATOR_STEP,
  SS_CARD_ORDER_REVIEW_STEP,
  SS_CARD_ORDER_OPTIONS_STEP,
  SS_GENERATE_CODES_STEP,
  SS_LANDING_PAGE_STEP,
  SS_MARKETPLACE_STEP,
  SS_ORDER_STATUS_FINAL_STEP,
  SS_OWNERSHIP_STEP,
  SS_REQUIRED_ACTIONS_STEP,
} from '../../../../../../constants/swagSelect.constants';

import CampaignNameSection from './Sections/CampaignNameSection/CampaignNameSection';
import ChooseSwagCampaignTypeSection from './Sections/ChooseSwagCampaignTypeSection/ChooseSwagCampaignTypeSection';
import ChooseCampaignOwnerSection from './Sections/ChooseCampaignOwnerSection/ChooseCampaignOwnerSection';
import SwagMarketplaceOptionsSection from './Sections/SwagMarketplaceOptionsSection/SwagMarketplaceOptionsSection';
import LandingPageMessageSection from './Sections/LandingPageMessageSection/LandingPageMessageSection';
import SelectRecipientActionSection from './Sections/SelectRecipientActionsSection/SelectRecipientActionsSection';
import SetDetailsAndDownloadSection from './Sections/SetDetailsAndDownloadSection/SetDetailsAndDownloadSection';
import GiftCardConfiguratorSection from './Sections/GiftCardConfiguratorSection/GiftCardConfiguratorSection';
import CardOrderOptionsSection from './Sections/CardOrderOptionsSection/CardOrderOptionsSection';
import ReviewCardOptionsSection from './Sections/ReviewCardOptionsSection/ReviewCardOptionsSection';
import OrderCardsStatusSection from './Sections/OrderCardsStatusSection/OrderCardsStatusSection';
import SwagSelectExchangeOption from './Sections/SwagSelectExchangeOption/SwagSelectExchangeOption';

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: 600,
    maxWidth: 912,
    height: 'calc(100vh - 80px)',
    overflow: 'scroll',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
}));

const STEPS_COMPONENT_MAPPER = {
  [SS_CAMPAIGN_TYPE_STEP]: props => <ChooseSwagCampaignTypeSection {...props} />,
  [SS_CAMPAIGN_NAME_STEP]: props => <CampaignNameSection {...props} />,
  [SS_OWNERSHIP_STEP]: props => <ChooseCampaignOwnerSection {...props} />,
  [SS_BUDGET_STEP]: props => <SwagSelectExchangeOption {...props} />,
  [SS_MARKETPLACE_STEP]: props => <SwagMarketplaceOptionsSection {...props} />,
  [SS_LANDING_PAGE_STEP]: props => <LandingPageMessageSection {...props} />,
  [SS_REQUIRED_ACTIONS_STEP]: props => <SelectRecipientActionSection {...props} />,
  [SS_GENERATE_CODES_STEP]: props => <SetDetailsAndDownloadSection {...props} />,
  [SS_CARD_CONFIGURATOR_STEP]: props => <GiftCardConfiguratorSection {...props} />,
  [SS_CARD_ORDER_OPTIONS_STEP]: props => <CardOrderOptionsSection {...props} />,
  [SS_CARD_ORDER_REVIEW_STEP]: props => <ReviewCardOptionsSection {...props} />,
  [SS_ORDER_STATUS_FINAL_STEP]: props => <OrderCardsStatusSection {...props} />,
};

const SwagSelectWizard = () => {
  const classes = useStyles();
  const campaignId = useSelector(getSwagSelectCampaignId);
  const generateSwagDigitalSteps = useSelector(getSwagSelectCampaignSteps);

  return (
    <Box className={classes.container}>
      {Object.entries(generateSwagDigitalSteps).map(([key, step], i) => (
        <CampaignSidebarSectionWrapper key={key} status={step.status}>
          {STEPS_COMPONENT_MAPPER[key]({ ...generateSwagDigitalSteps[key], order: i + 1, campaignId })}
        </CampaignSidebarSectionWrapper>
      ))}
    </Box>
  );
};

export default SwagSelectWizard;
