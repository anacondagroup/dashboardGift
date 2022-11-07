export interface IUploadRecipientsResponse {
  data: IUploadRequest | null;
}

export interface IUploadRequest {
  id: number;
  type: UploadRequestTypes;
  attributes: IUploadRequestAttributes;
}

export enum UploadRequestTypes {
  Uploading = 'uploading',
  Copying = 'copying',
}

export interface IUploadRequestAttributes {
  status: UploadRequestStatuses;
  errorMessage: string | null;
  total: number;
  completed: number;
  duplicated: number;
  optedOut: number;
  incorrect: number;
  source: UploadRequestSourceTypes;
  report: string | null;
}

export enum UploadRequestStatuses {
  Complete = 'complete',
  Process = 'process',
  Error = 'error',
}

export enum UploadRequestSourceTypes {
  File = 'file',
  MarketoStatic = 'marketo_static',
  MarketoDynamic = 'marketo_dynamic',
  Eloqua = 'eloqua',
  HubSpot = 'hubspot',
}

/*
 *  TODO Will be replaced with UploadRequestSourceTypes enum which declared above once backend uses the same unum for both
 *  endpoints returning contacts uploading request data
 * */
export enum OutdatedUploadRequestSourceTypes {
  File = 'file',
  MarketoStatic = 'static_list',
  MarketoDynamic = 'dynamic_list',
  Eloqua = 'eloqua',
  HubSpot = 'hubspot',
}
