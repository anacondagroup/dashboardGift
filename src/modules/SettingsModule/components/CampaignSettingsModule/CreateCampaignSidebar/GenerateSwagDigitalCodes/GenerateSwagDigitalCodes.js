import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import CampaignSidebarSectionWrapper from '../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CampaignSidebarSectionWrapper';
import {
  getSwagDigitalCodesCampaignId,
  getSwagDigitalCodesSteps,
  getSwagDigitalCodesTeamId,
} from '../../../../store/campaign/swagDigitalCodes/swagDigitalCodes.selectors';
import { loadGeneralSettingsBatchOwnersRequest } from '../../../../store/campaign/batchOwners/batchOwners.actions';

import ChooseCampaignOwnerSection from './Sections/ChooseCampaignOwnerSection/ChooseCampaignOwnerSection';
import SetDetailsAndDownloadSection from './Sections/SetDetailsAndDownloadSection/SetDetailsAndDownloadSection';

const useStyles = makeStyles(theme => ({
  container: {
    width: 600,
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
  GSD_STEP_1: props => <ChooseCampaignOwnerSection {...props} />,
  GSD_STEP_2: props => <SetDetailsAndDownloadSection {...props} />,
};

const GenerateSwagDigitalCodes = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const campaignId = useSelector(getSwagDigitalCodesCampaignId);
  const teamId = useSelector(getSwagDigitalCodesTeamId);
  const swagSelectWizardSteps = useSelector(getSwagDigitalCodesSteps);

  useEffect(() => {
    dispatch(loadGeneralSettingsBatchOwnersRequest(campaignId));
  }, [campaignId, dispatch]);

  return (
    <Box className={classes.container}>
      {Object.keys(swagSelectWizardSteps).map(step => (
        <CampaignSidebarSectionWrapper
          key={swagSelectWizardSteps[step].order}
          status={swagSelectWizardSteps[step].status}
        >
          {STEPS_COMPONENT_MAPPER[step]({ ...swagSelectWizardSteps[step], campaignId, teamId })}
        </CampaignSidebarSectionWrapper>
      ))}
    </Box>
  );
};

GenerateSwagDigitalCodes.propTypes = {};

export default GenerateSwagDigitalCodes;
