import { combineReducers } from 'redux';

import { users, IUsersState } from './users/users.reducer';
import { entities, IUsersManagementEntitiesState } from './entities';
import { usersOperation, IUsersOperationState } from './usersOperation/usersOperation.reducer';
import { usersCreate, IUsersCreateState } from './usersCreate/usersCreate.reducer';
import { bulkCreate, IBulkCreateState } from './bulkCreate';

export interface IUsersManagementState {
  entities: IUsersManagementEntitiesState;
  users: IUsersState;
  usersCreate: IUsersCreateState;
  usersOperation: IUsersOperationState;
  bulkCreate: IBulkCreateState;
}

const reducer = combineReducers<IUsersManagementState>({
  entities,
  users,
  usersCreate,
  usersOperation,
  bulkCreate,
});

export default reducer;
