import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { Icon, Tooltip } from '@alycecom/ui';
import { CampaignSettings, Features, HasFeature } from '@alycecom/modules';

import {
  closeContactsUploadingSidebar,
  getContactsSidebarState,
  getIsUploadingContactsSidebarOpened,
  openContactsUploadingSidebar,
} from '../../store/ui/createPage/contactsSidebar';
import ActionButton from '../ActionButton';
import { useTrackCampaignBuilderNextButtonClicked } from '../../hooks/useTrackActivate';
import { ContactsUploadingStates } from '../../constants/recipientSidebar.constants';
import { getIsFreeClaimEnabled, getIsPreApprovedClaimEnabled } from '../../store/steps/details';
import { useActivate } from '../../hooks/useActivate';
import { ActivateBuilderStep } from '../../routePaths';
import { useBuilderSteps } from '../../hooks/useBuilderSteps';
import ActivateBuilderFooter from '../ActiateBuilderFooter/ActivateBuilderFooter';

import GiftingOnTheFly from './GiftingOnTheFly/GiftingOnTheFly';
import ContactsUploadingSidebar from './ContactsUploadingSidebar';

const styles = {
  stepWrapper: {
    width: 650,
  },
  greenTip: {
    my: 3,
    px: 4,
    py: 2,
    backgroundColor: 'green.fruitSaladLight',
    borderRadius: 1,
  },
  yellowTip: {
    mt: 3,
    px: 4,
    py: 2,
    backgroundColor: 'secondary.light',
    borderRadius: 5,
  },
} as const;

const RecipientsStep = (): JSX.Element => {
  const dispatch = useDispatch();

  const { campaignId } = useActivate();
  const { goToNextStep, goToPrevStep } = useBuilderSteps();

  const sidebarState = useSelector(getContactsSidebarState);
  const isFreeClaimEnabled = useSelector(getIsFreeClaimEnabled);
  const isPreApprovedClaimEnabled = useSelector(getIsPreApprovedClaimEnabled);

  const trackNextButtonClicked = useTrackCampaignBuilderNextButtonClicked(ActivateBuilderStep.Recipients);
  const hasRecipientList = sidebarState === ContactsUploadingStates.Completed;

  const isUploadingContactsSidebarOpened = useSelector(getIsUploadingContactsSidebarOpened);

  const handleOpenSidebar = useCallback(() => dispatch(openContactsUploadingSidebar()), [dispatch]);
  const handleCloseSidebar = useCallback(() => dispatch(closeContactsUploadingSidebar()), [dispatch]);

  const handleNext = useCallback(() => {
    goToNextStep();
    trackNextButtonClicked(campaignId as number, { hasRecipientList });
  }, [goToNextStep, trackNextButtonClicked, campaignId, hasRecipientList]);

  const disabledReason =
    'To use this feature you need to select the "add pre-approved recipients" option on the Details step.';
  const SafeTooltip = isFreeClaimEnabled ? Tooltip : Fragment;

  return (
    <>
      <CampaignSettings.StyledSectionTitle maxWidth={792}>Manage recipients</CampaignSettings.StyledSectionTitle>
      <Box sx={styles.stepWrapper}>
        {isFreeClaimEnabled && <Box sx={styles.greenTip}>You have enabled unknown recipients for this campaign</Box>}

        <Typography className="Body-Regular-Left-Static-Bold">(Optional) Add Recipients</Typography>
        <Typography className="Subcopy-Static-Alt">Recipients may be added anytime after campaign creation.</Typography>

        <Box my={3}>
          <SafeTooltip title={disabledReason} arrow placement="top" component="span">
            <ActionButton
              disabled={isFreeClaimEnabled}
              onClick={handleOpenSidebar}
              variant="outlined"
              endIcon={<Icon icon="list-ul" />}
            >
              Add Recipients
            </ActionButton>
          </SafeTooltip>
        </Box>

        <Typography className="Subcopy-Static-Alt">
          Currently supported: XLSX spreadsheets and Marketo integration
        </Typography>

        {isPreApprovedClaimEnabled && (
          <Box sx={styles.yellowTip}>
            <b>Important Note</b>: recipients <b>must</b> be added to a campaign before a gift link is sent - otherwise
            they will be unable to redeem their gift.
          </Box>
        )}

        <ContactsUploadingSidebar isOpen={isUploadingContactsSidebarOpened} onClose={handleCloseSidebar} />

        <HasFeature featureKey={Features.FLAGS.GIFTING_ON_THE_FLY}>
          <Box mt={9}>
            <GiftingOnTheFly disabled={isFreeClaimEnabled} disabledReason={disabledReason} />
          </Box>
        </HasFeature>
      </Box>
      <ActivateBuilderFooter wrap onClickNext={handleNext} onClickBack={goToPrevStep} />
    </>
  );
};

export default RecipientsStep;
