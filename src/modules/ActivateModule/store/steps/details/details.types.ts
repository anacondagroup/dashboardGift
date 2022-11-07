import { IActivateDetails, IActivateDraft } from '../../activate.types';

export type TUpdateBuilderDetailsBody = Pick<
  IActivateDetails,
  | 'campaignName'
  | 'ownerId'
  | 'expirationDate'
  | 'notificationSettings'
  | 'sendAsOption'
  | 'sendAsId'
  | 'campaignPurpose'
  | 'ownPurpose'
  | 'numberOfRecipients'
  | 'freeClaims'
  | 'teamId'
>;

export type TUpdateEditorDetailsBody = Omit<TUpdateBuilderDetailsBody, 'teamId'>;

export interface ICreateActivateResponse {
  data: IActivateDraft;
}
