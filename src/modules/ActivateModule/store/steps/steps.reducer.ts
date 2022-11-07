import { combineReducers } from 'redux';

import { details, IDetailsState } from './details';
import { gift, IGiftState } from './gift';
import messaging, { IMessagingState } from './messaging/messaging.reducer';
import { recipients, IRecipientsState } from './recipients';
import { finalize, IFinalizeState } from './finalize';

export interface IActivateStepsState {
  details: IDetailsState;
  gift: IGiftState;
  messaging: IMessagingState;
  recipients: IRecipientsState;
  finalize: IFinalizeState;
}

const reducer = combineReducers<IActivateStepsState>({
  details,
  gift,
  messaging,
  recipients,
  finalize,
});

export default reducer;
