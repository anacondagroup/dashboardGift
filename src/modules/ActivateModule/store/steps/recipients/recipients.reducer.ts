import { combineReducers } from 'redux';

import { uploadRequest, IUploadRequestState } from './uploadRequest';
import { marketo, IMarketoState } from './marketo';
import { contacts, IContactsState } from './contacts';
import { contact, IContactState } from './contact';
import { eloqua, IEloquaState } from './eloqua';
import { giftingOnTheFly, IGiftingOnTheFlyState } from './giftingOnTheFly/giftingOnTheFly.reducer';

export interface IRecipientsState {
  uploadRequest: IUploadRequestState;
  marketo: IMarketoState;
  contacts: IContactsState;
  contact: IContactState;
  giftingOnTheFly: IGiftingOnTheFlyState;
  eloqua: IEloquaState;
}

export const recipients = combineReducers<IRecipientsState>({
  uploadRequest,
  marketo,
  contacts,
  contact,
  eloqua,
  giftingOnTheFly,
});
