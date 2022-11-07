import React, { memo, useCallback } from 'react';
import { AlyceTheme, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { Box, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';

import {
  closeContactsUploadingSidebar,
  getContactsSidebarState,
  setSourceType,
} from '../../store/ui/createPage/contactsSidebar';
import { ContactsUploadingStates, SourceTypes } from '../../constants/recipientSidebar.constants';
import { getDetailsData } from '../../store/steps/details';
import { getIsRecipientsLoading, getUploadRequestAttributes } from '../../store/steps/recipients';
import { ActivateBuilderStep } from '../../routePaths';
import {
  useTrackCampaignBuilderNextButtonClicked,
  useTrackCampaignEditorSaveButtonClicked,
} from '../../hooks/useTrackActivate';
import { saveEloquaSourceTypeRequest } from '../../store/steps/recipients/eloqua';
import { saveHubSpotSourceTypeRequest } from '../../store/steps/recipients/hubspot/hubspot.actions';
import { useActivate } from '../../hooks/useActivate';

import ChooseSourceType from './ChooseSourceType/ChooseSourceType';
import FileUploading from './FileUploading/FileUploading';
import PollingView from './PollingView/PollingView';
import UploadingContactsSuccess from './UploadingContactsSuccess/UploadingContactsSuccess';
import UploadingContactsFail from './UploadingContactsFail/UploadingContactsFail';
import UploadWithSelectedIntegration from './UploadWithSelectedIntegration/UploadWithSelectedIntegration';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  content: {
    backgroundColor: palette.common.white,
    height: '100vh',
    width: 600,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 80,
    color: palette.common.white,
    backgroundColor: palette.primary.dark,
  },
  title: {
    fontSize: 20,
    paddingLeft: spacing(4),
  },
  border: {
    margin: spacing(2),
    borderRadius: 5,
    border: `2px solid`,
    borderColor: palette.green.dark,
    paddingTop: 24,
    paddingBottom: 24,
  },
}));

interface IContactsUploadingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactsUploadingSidebar = ({ isOpen, onClose }: IContactsUploadingSidebarProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { campaignId, isBuilder } = useActivate();

  const trackNextButtonClicked = useTrackCampaignBuilderNextButtonClicked(ActivateBuilderStep.Recipients);
  const trackCampaignEditorSaveButtonClicked = useTrackCampaignEditorSaveButtonClicked(ActivateBuilderStep.Recipients);

  const state = useSelector(getContactsSidebarState);
  const detailsData = useSelector(getDetailsData);
  const attributes = useSelector(getUploadRequestAttributes);
  const hasRecipientList = state === ContactsUploadingStates.Completed;

  const isRecipientsLoading = useSelector(getIsRecipientsLoading);

  const closeSidebar = useCallback(() => {
    dispatch(closeContactsUploadingSidebar());
  }, [dispatch]);

  const handleSourceTypeSelect = useCallback(
    (sourceType: SourceTypes) => {
      if (sourceType === SourceTypes.Eloqua) {
        dispatch(saveEloquaSourceTypeRequest());
        return;
      }
      if (sourceType === SourceTypes.HubSpot) {
        dispatch(saveHubSpotSourceTypeRequest());
        return;
      }
      dispatch(setSourceType(sourceType));
    },
    [dispatch],
  );

  const handleSuccessUploading = useCallback(() => {
    if (isBuilder) {
      trackNextButtonClicked(campaignId as number, { hasRecipientList });
    } else {
      trackCampaignEditorSaveButtonClicked(campaignId as number);
    }
    closeSidebar();
  }, [
    closeSidebar,
    trackNextButtonClicked,
    trackCampaignEditorSaveButtonClicked,
    isBuilder,
    campaignId,
    hasRecipientList,
  ]);

  return (
    <ProductSidebar isOpen={isOpen} onClose={onClose} width={600}>
      <ProductSidebarHeader onClose={onClose}>
        <Box ml={2} fontSize="20px">
          Recipients Uploading
        </Box>
      </ProductSidebarHeader>

      <Paper elevation={2} className={classes.border}>
        {state === ContactsUploadingStates.ChooseSource && <ChooseSourceType onSelect={handleSourceTypeSelect} />}
        {state === ContactsUploadingStates.XLSX && <FileUploading isLoading={isRecipientsLoading} />}
        {state === ContactsUploadingStates.Integration && <UploadWithSelectedIntegration />}
        {state === ContactsUploadingStates.Processing && attributes && <PollingView attributes={attributes} />}
        {state === ContactsUploadingStates.Completed && detailsData && attributes && (
          <UploadingContactsSuccess
            campaignName={detailsData.campaignName}
            attributes={attributes}
            onSuccess={handleSuccessUploading}
          />
        )}
        {state === ContactsUploadingStates.Error && detailsData && attributes && (
          <UploadingContactsFail
            campaignName={detailsData.campaignName}
            attributes={attributes}
            onSuccess={handleSuccessUploading}
          />
        )}
      </Paper>
    </ProductSidebar>
  );
};

export default memo(ContactsUploadingSidebar);
