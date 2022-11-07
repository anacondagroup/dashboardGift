import React from 'react';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import CampaignSidebarSectionWrapper from '../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CampaignSidebarSectionWrapper';
import { GSP_STEP_1, GSP_STEP_2, GSP_STEP_3, GSP_STEP_4 } from '../../../../../../constants/swagPhysical.constants';
import OrderCardsStatusSection from '../SwagSelectWizard/Sections/OrderCardsStatusSection/OrderCardsStatusSection';
import {
  getSwagPhysicalCodesCampaignId,
  getSwagPhysicalCodesSections,
  getSwagPhysicalCodesTeamId,
  getSwagPhysicalOrderData,
} from '../../../../store/campaign/swagPhysicalCodes/swagPhysicalCodes.selectors';

import ChooseCampaignOwnerSection from './Sections/ChooseCampaignOwnerSection/ChooseCampaignOwnerSection';
import CardOrderOptionsSection from './Sections/CardOrderOptionsSection/CardOrderOptionsSection';
import ReviewCardOptionsSection from './Sections/ReviewCardOptionsSection/ReviewCardOptionsSection';

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 720,
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
  [GSP_STEP_1]: props => <ChooseCampaignOwnerSection {...props} />,
  [GSP_STEP_2]: props => <CardOrderOptionsSection {...props} />,
  [GSP_STEP_3]: props => <ReviewCardOptionsSection {...props} />,
  [GSP_STEP_4]: props => <OrderCardsStatusSection {...props} getOrderData={getSwagPhysicalOrderData} />,
};

const GenerateSwagPhysicalCodes = () => {
  const classes = useStyles();
  const campaignId = useSelector(getSwagPhysicalCodesCampaignId);
  const teamId = useSelector(getSwagPhysicalCodesTeamId);
  const sections = useSelector(getSwagPhysicalCodesSections);

  return (
    <Box className={classes.container}>
      {Object.entries(sections).map(([key, step], i) => (
        <CampaignSidebarSectionWrapper key={key} status={step.status}>
          {STEPS_COMPONENT_MAPPER[key]({ ...sections[key], campaignId, teamId, order: i + 1 })}
        </CampaignSidebarSectionWrapper>
      ))}
    </Box>
  );
};

GenerateSwagPhysicalCodes.propTypes = {};

export default GenerateSwagPhysicalCodes;
