import { IUploadRequestAttributes, UploadRequestSourceTypes } from './uploadRequest/uploadRequest.types';

export interface IRecipients {
  sourceType: UploadRequestSourceTypes | null;
  marketoComputedUrl: string | null;
  attributes: IUploadRequestAttributes | null;
}
