import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { CompliancePopup } from '@alycecom/ui';
import { useTrackComplianceLinkVisited, useTrackComplianceSubmitted, User } from '@alycecom/modules';
import { useUnmount } from 'react-use';
import { useGetCampaignByIdQuery } from '@alycecom/services';
import { skipToken } from '@reduxjs/toolkit/query';

import {
  uploadFile,
  bulkImport,
  resetPreview,
  updateContact,
  downloadTemplate,
  bulkImportFinish,
  removeContact,
  bulkUploadReset,
} from '../../store/bulkCreateContacts/import/import.actions';
import {
  getContacts,
  getIsLoading,
  getUploadError,
  getValidationErrors,
  getBulkImportTotalContacts,
  getBulkImportId,
} from '../../store/bulkCreateContacts/import/import.selectors';
import { useTrackBulkSubmittedEffect } from '../../hooks/useTrackSidebar';

import ImportingProcess from './steps/ImportingProcess/ImportingProcess';
import ImportEditStep from './steps/ImportEditStep';
import UploadFileStep from './steps/UploadFileStep';
import StepWrapper from './steps/StepWrapper';
import { IMPORT_FILE_STEP, SHOW_PREVIEW_STEP, IS_CREATED_STEP } from './steps.constants';

const LARGE_WIDTH = 1200;
const MEDIUM_WIDTH = 600;

const BulkCreateContacts = ({ goBack, onClose, onWidthSet, initialWidth, campaignId }) => {
  const dispatch = useDispatch();

  const [file, setFile] = useState({});

  const user = useSelector(User.selectors.getUser);
  const totalContacts = useSelector(getBulkImportTotalContacts);
  const importId = useSelector(getBulkImportId);
  const contacts = useSelector(getContacts);
  const uploadError = useSelector(getUploadError);
  const validationErrors = useSelector(getValidationErrors);
  const isLoading = useSelector(getIsLoading);

  const { data: campaign } = useGetCampaignByIdQuery(campaignId || skipToken);

  const trackComplianceSubmitted = useTrackComplianceSubmitted(user);
  const trackComplianceLinkVisited = useTrackComplianceLinkVisited(user);

  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const {
    team: {
      settings: {
        complianceIsRequired = false,
        compliancePromptText = '',
        complianceRevertText = '',
        complianceLink = '',
      } = {},
    } = {},
  } = campaign || {};

  const onCloseHandler = useCallback(() => {
    dispatch(bulkImportFinish());
    onClose();
  }, [onClose, dispatch]);

  const currentStep = useMemo(() => {
    if (totalContacts > 0) {
      return IS_CREATED_STEP;
    }
    if (contacts.length || isLoading) {
      return SHOW_PREVIEW_STEP;
    }

    return IMPORT_FILE_STEP;
  }, [contacts, isLoading, totalContacts]);

  const handleFileChange = useCallback(e => {
    if (!e.target.files[0]) {
      return;
    }
    setFile(e.target.files[0]);
  }, []);

  const handleUploadFile = useCallback(() => {
    if (complianceIsRequired) {
      setIsComplianceOpen(true);
    } else {
      dispatch(uploadFile({ file, campaignId: campaign.id }));
    }
  }, [dispatch, campaign, complianceIsRequired, file]);

  const onBulkCreateHandler = useCallback(() => {
    dispatch(bulkImport({ contacts, campaignId: campaign.id, importId }));
  }, [contacts, campaign, importId, dispatch]);

  const handleFinishCompliance = useCallback(
    isSuccessful => {
      trackComplianceSubmitted(isSuccessful);
      if (isSuccessful) {
        dispatch(uploadFile({ file, campaignId: campaign.id }));
      } else {
        onClose();
      }

      setIsComplianceOpen(false);
    },
    [dispatch, trackComplianceSubmitted, file, campaign, onClose],
  );

  const handleGoBackToUpload = useCallback(() => {
    dispatch(resetPreview());
  }, [dispatch]);

  const handleUpdateContact = useCallback(
    updateContactData => {
      dispatch(updateContact(updateContactData));
    },
    [dispatch],
  );

  const handleDownloadTemplate = useCallback(() => {
    dispatch(downloadTemplate());
  }, [dispatch]);

  const handleDeletePreviewRow = useCallback(
    contact => {
      dispatch(removeContact(contact));
    },
    [dispatch],
  );

  useTrackBulkSubmittedEffect(campaign && campaign.research_flow);

  useEffect(() => {
    switch (currentStep) {
      case SHOW_PREVIEW_STEP:
        onWidthSet(LARGE_WIDTH);
        break;
      case IS_CREATED_STEP:
      case IMPORT_FILE_STEP:
        onWidthSet(MEDIUM_WIDTH);
        break;
      default:
        onWidthSet(initialWidth);
    }
  }, [currentStep, onWidthSet, initialWidth]);

  useEffect(() => {
    if (uploadError && uploadError.campaign_id) {
      dispatch(bulkUploadReset());
    }
  }, [uploadError, dispatch]);

  useUnmount(() => onWidthSet(initialWidth));

  return (
    <Box p={2}>
      <CompliancePopup
        isOpen={isComplianceOpen}
        width={MEDIUM_WIDTH}
        onFinish={handleFinishCompliance}
        promptText={compliancePromptText}
        revertText={complianceRevertText}
        onLinkVisited={trackComplianceLinkVisited}
        link={complianceLink}
      />
      {currentStep === IMPORT_FILE_STEP && (
        <StepWrapper goBackText="Back" goBackDisabled={isLoading} onGoBack={goBack}>
          <UploadFileStep
            teamName={campaign && campaign.team && campaign.team.name}
            onChange={handleFileChange}
            fileName={file.name}
            onUpload={handleUploadFile}
            uploadError={uploadError.import_file}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </StepWrapper>
      )}
      {currentStep === SHOW_PREVIEW_STEP && (
        <StepWrapper goBackText="Back to list upload" goBackDisabled={isLoading} onGoBack={handleGoBackToUpload}>
          <ImportEditStep
            contacts={contacts}
            onContactUpdate={handleUpdateContact}
            campaignName={campaign && campaign.name}
            isLoading={isLoading}
            onBulkCreateHandler={onBulkCreateHandler}
            onRowDelete={handleDeletePreviewRow}
            errors={validationErrors}
            lockedSendAs={campaign && campaign.hasLockedSendAs}
          />
        </StepWrapper>
      )}
      {currentStep === IS_CREATED_STEP && <ImportingProcess onClose={onCloseHandler} />}
    </Box>
  );
};

BulkCreateContacts.propTypes = {
  goBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onWidthSet: PropTypes.func.isRequired,
  initialWidth: PropTypes.number.isRequired,
  campaignId: PropTypes.number,
};

BulkCreateContacts.defaultProps = {
  campaignId: null,
};

export default memo(BulkCreateContacts);
