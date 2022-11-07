import { ActivateModes } from '../../../../routePaths';

import { IUploadRequestAttributes, UploadRequestSourceTypes, UploadRequestStatuses } from './uploadRequest.types';

export const isUploadRequestFaultless = ({
  duplicated,
  optedOut,
  incorrect,
  total,
  source,
  status,
}: IUploadRequestAttributes): boolean => {
  if (status !== UploadRequestStatuses.Complete) {
    return false;
  }
  if (total === 0) {
    return [
      UploadRequestSourceTypes.MarketoDynamic,
      UploadRequestSourceTypes.Eloqua,
      UploadRequestSourceTypes.HubSpot,
    ].includes(source);
  }
  return !(duplicated || optedOut || incorrect);
};

export const getLastUploadingRequestEndpoint = (draftIdOrCampaignId: string | number, mode: ActivateModes): string => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${draftIdOrCampaignId}/contacts/upload-requests/last-created`;
  }
  return `/api/v1/campaigns/activate/campaigns/${draftIdOrCampaignId}/contacts/upload-requests/last-created`;
};
