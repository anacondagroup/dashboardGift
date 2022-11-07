export enum RECIPIENT_LIST_SOURCE_TYPES {
  FILE = 'file',
  STATIC_LIST = 'marketo_static',
  SMART_CAMPAIGN = 'marketo_dynamic',
  ELOQUA = 'eloqua',
  HUBSPOT = 'hubspot',
}

export const UPLOAD_REQUEST_TYPE = 'upload-requests';

export interface IContactListUploadingAttributes {
  completed: number;
  duplicated: number;
  errorMessage: string;
  incorrect: number;
  optedOut: number;
  report: string;
  source: RECIPIENT_LIST_SOURCE_TYPES;
  status: string;
  total: number;
}

export interface IUploadRequestData {
  id: number;
  type: typeof UPLOAD_REQUEST_TYPE;
  attributes: IContactListUploadingAttributes;
}

export interface INewAPIResponse<T> {
  data: T;
}
