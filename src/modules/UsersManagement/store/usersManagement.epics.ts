import { usersEpics } from './users/users.epics';
import { usersOperationEpics } from './usersOperation/usersOperation.epics';
import { usersCreateEpics } from './usersCreate/usersCreate.epics';
import { entitiesEpics } from './entities';
import { bulkEpics } from './bulkCreate/bulkCreate.epics';

export default [...usersEpics, ...usersOperationEpics, ...usersCreateEpics, ...entitiesEpics, ...bulkEpics];
