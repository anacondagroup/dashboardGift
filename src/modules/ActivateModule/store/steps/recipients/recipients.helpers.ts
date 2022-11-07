import {
  IUploadRequestAttributes,
  UploadRequestSourceTypes,
  UploadRequestStatuses,
} from './uploadRequest/uploadRequest.types';

export const isRecipientsStepCompleted = (attributes: IUploadRequestAttributes): boolean => {
  const { status, source, errorMessage, completed } = attributes;
  const isUploadingCompleted = status === UploadRequestStatuses.Complete;
  const isSmartCampaignLinked = source === UploadRequestSourceTypes.MarketoDynamic && !errorMessage;
  const isEloquaCampaignLinked = source === UploadRequestSourceTypes.Eloqua && !errorMessage;
  const isHubspotCampaignLinked = source === UploadRequestSourceTypes.HubSpot && !errorMessage;
  const isContactsUploaded = completed > 0;

  return (
    isUploadingCompleted &&
    (isSmartCampaignLinked || isEloquaCampaignLinked || isContactsUploaded || isHubspotCampaignLinked)
  );
};
