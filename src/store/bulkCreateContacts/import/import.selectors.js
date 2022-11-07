import * as R from 'ramda';

import { getBulkCreateState } from '../bulkCreateContacts.selectors';

export const getPreviewState = R.compose(R.prop('preview'), getBulkCreateState);

export const getContacts = R.compose(R.prop('contacts'), getPreviewState);

export const getIsLoading = R.compose(R.prop('isLoading'), getPreviewState);

export const getUploadError = R.compose(R.prop('uploadError'), getPreviewState);

export const getCampaigns = R.compose(R.prop('campaigns'), getPreviewState);

export const getCampaignById = state => campaignId =>
  R.compose(
    R.find(campaign => campaign.id === campaignId),
    getCampaigns,
  )(state);

export const getValidationErrors = R.compose(R.prop('validationErrors'), getPreviewState);

export const getProcessedCount = R.compose(R.prop('processed'), getPreviewState);

export const getBulkImportId = R.path(['bulkCreate', 'preview', 'importId']);

export const getBulkImportStatus = R.path(['bulkCreate', 'preview', 'status']);

export const getBulkImportTotalContacts = R.path(['bulkCreate', 'preview', 'totalContacts']);
