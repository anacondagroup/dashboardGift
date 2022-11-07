import {
  BULK_UPLOAD_FILE_UPLOAD_REQUEST,
  BULK_UPLOAD_FILE_UPLOAD_FAIL,
  BULK_UPLOAD_FILE_UPLOAD_SUCCESS,
  BULK_IMPORT_UPDATE_CONTACT,
  BULK_UPLOAD_RESET_PREVIEW,
  BULK_UPLOAD_DOWNLOAD_TEMPLATE,
  BULK_UPLOAD_DOWNLOAD_TEMPLATE_SUCCESS,
  BULK_IMPORT_REMOVE_CONTACT,
  BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_REQUEST,
  BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_SUCCESS,
  BULK_IMPORT_REQUEST,
  BULK_IMPORT_SUCCESS,
  BULK_IMPORT_VALIDATION_ERRORS,
  BULK_IMPORT_FINISH,
  BULK_IMPORT_FAIL,
  BULK_UPLOAD_RESET,
  BULK_CREATE,
} from './import.types';

export const uploadFile = ({ file, campaignId }) => ({
  type: BULK_UPLOAD_FILE_UPLOAD_REQUEST,
  payload: { file, campaignId },
});

export const uploadFileSuccess = ({ contacts, errors, importId }) => ({
  type: BULK_UPLOAD_FILE_UPLOAD_SUCCESS,
  payload: { contacts, errors, importId },
});

export const uploadFileFail = error => ({
  type: BULK_UPLOAD_FILE_UPLOAD_FAIL,
  payload: error,
});

export const resetPreview = () => ({
  type: BULK_UPLOAD_RESET_PREVIEW,
});

export const downloadTemplate = () => ({
  type: BULK_UPLOAD_DOWNLOAD_TEMPLATE,
});

export const downloadTemplateSuccess = () => ({
  type: BULK_UPLOAD_DOWNLOAD_TEMPLATE_SUCCESS,
});

export const updateContact = ({ contact, updatedData, field }) => ({
  type: BULK_IMPORT_UPDATE_CONTACT,
  payload: { contact, updatedData, field },
});

export const removeContact = contact => ({
  type: BULK_IMPORT_REMOVE_CONTACT,
  payload: contact,
});

export const getAvailableCampaigns = teamId => ({
  type: BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_REQUEST,
  payload: teamId,
});

export const getAvailableCampaignsSuccess = campaigns => ({
  type: BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_SUCCESS,
  payload: campaigns,
});

export const bulkImport = ({ contacts, campaignId, teamId, importId }) => ({
  type: BULK_IMPORT_REQUEST,
  payload: { contacts, campaign_id: campaignId, team_id: teamId, importId },
});

export const bulkImportSuccess = response => ({
  type: BULK_IMPORT_SUCCESS,
  payload: response,
});
export const bulkImportFail = error => ({
  type: BULK_IMPORT_FAIL,
  payload: error,
});

export const bulkImportValidationErrors = errors => ({
  type: BULK_IMPORT_VALIDATION_ERRORS,
  payload: errors,
});

export const bulkImportFinish = () => ({
  type: BULK_IMPORT_FINISH,
});

export const bulkUploadReset = () => ({
  type: BULK_UPLOAD_RESET,
});

export const waitForBulkImport = importId => ({
  type: BULK_CREATE.WAIT_FOR_IMPORT_START,
  payload: importId,
});

export const waitForBulkImportUpdate = importStatus => ({
  type: BULK_CREATE.WAIT_FOR_IMPORT_UPDATE,
  payload: importStatus,
});

export const waitForBulkImportFail = () => ({
  type: BULK_CREATE.WAIT_FOR_IMPORT_FAIL,
});

export const waitForBulkImportCancel = () => ({
  type: BULK_CREATE.WAIT_FOR_IMPORT_CANCEL,
});
