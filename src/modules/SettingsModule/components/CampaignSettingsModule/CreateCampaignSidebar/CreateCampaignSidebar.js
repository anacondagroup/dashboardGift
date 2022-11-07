import React, { useCallback, useMemo } from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useRouting } from '@alycecom/hooks';
import { Features } from '@alycecom/modules';
import { SidebarHeader as HeaderTopBar } from '@alycecom/ui';

import giftingFlowImage from '../../../../../assets/images/contact-details-top-bar.svg';
import { getCampaignSidebarMode } from '../../../store/campaign/createCampaignSidebar/createCampaignSidebar.selectors';
import { CREATE_CAMPAIGN_SIDEBAR_MODES } from '../../../store/campaign/createCampaignSidebar/createCampaignSidebar.reducer';
import {
  createCampaignSidebarClose,
  createCampaignSidebarSwagSelect,
} from '../../../store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import { swagSelectWizardInit } from '../../../store/campaign/swagSelect/swagSelect.actions';
import { getCampaignTypeName } from '../../../../../helpers/campaignSettings.helpers';
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import { ProspectingCampaignRoutes } from '../../../../ProspectingCampaignModule/routePaths';
import { StandardCampaignRoutes } from '../../StandardCampaignModule/routePaths';
import { ActivateCampaignRoutes } from '../../../../ActivateModule/routePaths';
import { SwagCampaignRoutes } from '../../../../SwagCampaignModule/routePaths';

import SwagSelectWizard from './SwagSelectWizard/SwagSelectWizard';
import ChooseCampaignType from './ChooseCampaignType/ChooseCampaignType';
import GenerateSwagDigitalCodes from './GenerateSwagDigitalCodes/GenerateSwagDigitalCodes';
import GenerateSwagPhysicalCodes from './GenerateSwagPhysicalCodes/GenerateSwagPhysicalCodes';

const useStyles = makeStyles(({ palette }) => ({
  title: ({ titleWidth }) => ({
    color: palette.common.white,
    fontSize: 20,
    width: titleWidth,
    lineHeight: 1.25,
  }),
}));

const CreateCampaignSidebar = () => {
  const dispatch = useDispatch();
  const go = useRouting();
  const sidebarMode = useSelector(getCampaignSidebarMode);
  const isSidebarOpen = sidebarMode !== CREATE_CAMPAIGN_SIDEBAR_MODES.CLOSED;
  const titleWidth = sidebarMode === CREATE_CAMPAIGN_SIDEBAR_MODES.CHOOSE_CAMPAIGN ? 305 : 500;
  const classes = useStyles({ titleWidth });
  const hasGiftRedemptionCardsEnabled = useSelector(
    Features.selectors.hasFeatureFlags(Features.FLAGS.GIFT_REDEMPTION_CODES_2_0),
  );

  const closeSidebar = useCallback(() => dispatch(createCampaignSidebarClose(sidebarMode)), [dispatch, sidebarMode]);

  const handleStandardCampaignSelection = useCallback(() => {
    closeSidebar();
    go(StandardCampaignRoutes.buildCreateUrl());
  }, [closeSidebar, go]);

  const handleNewActivateCampaignSelection = useCallback(() => {
    closeSidebar();
    go(ActivateCampaignRoutes.buildBuilderUrl());
  }, [closeSidebar, go]);

  const handleSwagSelectCampaign = useCallback(() => {
    if (hasGiftRedemptionCardsEnabled) {
      closeSidebar();
      go(SwagCampaignRoutes.buildBuilderUrl());
    } else {
      dispatch(createCampaignSidebarSwagSelect());
      dispatch(swagSelectWizardInit());
    }
  }, [hasGiftRedemptionCardsEnabled, dispatch, closeSidebar, go]);

  const handleProspectingCampaign = useCallback(() => {
    closeSidebar();
    go(ProspectingCampaignRoutes.buildBuilderUrl());
  }, [closeSidebar, go]);

  const title = useMemo(() => {
    switch (sidebarMode) {
      case CREATE_CAMPAIGN_SIDEBAR_MODES.CHOOSE_CAMPAIGN:
        return 'What campaign type would you like to create?';
      case CREATE_CAMPAIGN_SIDEBAR_MODES.SWAG_SELECT:
        return `Create a ${getCampaignTypeName(CAMPAIGN_TYPES.SWAG)} campaign!`;
      case CREATE_CAMPAIGN_SIDEBAR_MODES.GENERATE_SWAG_DIGITAL_CODES:
        return "Let's generate some more codes!";
      case CREATE_CAMPAIGN_SIDEBAR_MODES.GENERATE_SWAG_PHYSICAL_CODES:
        return "Let's generate some more codes!";
      case CREATE_CAMPAIGN_SIDEBAR_MODES.LOADING_DATA:
        return 'Loading campaign data...';
      default:
        return 'What campaign type would you like to create?';
    }
  }, [sidebarMode]);

  return (
    <Drawer open={isSidebarOpen} anchor="right" onClose={closeSidebar}>
      <Box>
        <HeaderTopBar onClose={closeSidebar} bgTheme="green-light-gradient" bgImage={giftingFlowImage}>
          <Typography className={classes.title}>{title}</Typography>
        </HeaderTopBar>
      </Box>
      {sidebarMode === CREATE_CAMPAIGN_SIDEBAR_MODES.CHOOSE_CAMPAIGN && (
        <ChooseCampaignType
          handleStandardCampaign={handleStandardCampaignSelection}
          handleSwagSelectCampaign={handleSwagSelectCampaign}
          handleNewActivateCampaign={handleNewActivateCampaignSelection}
          handleProspectingCampaign={handleProspectingCampaign}
        />
      )}
      {sidebarMode === CREATE_CAMPAIGN_SIDEBAR_MODES.SWAG_SELECT && <SwagSelectWizard />}
      {sidebarMode === CREATE_CAMPAIGN_SIDEBAR_MODES.GENERATE_SWAG_DIGITAL_CODES && <GenerateSwagDigitalCodes />}
      {sidebarMode === CREATE_CAMPAIGN_SIDEBAR_MODES.GENERATE_SWAG_PHYSICAL_CODES && <GenerateSwagPhysicalCodes />}
    </Drawer>
  );
};

export default CreateCampaignSidebar;
