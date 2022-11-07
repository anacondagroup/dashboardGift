import { TrackEvent } from '@alycecom/services';

import { permissionsEpics } from './permissions/permissions.epics';
import { updateStateUpdatedTimeEpic } from './stateUpdatedTime/stateUpdatedTime.epics';
import { invitationsEpics } from './invitations/invitations.epics';

export default [...permissionsEpics, updateStateUpdatedTimeEpic, ...TrackEvent.trackEventEpics, ...invitationsEpics];
