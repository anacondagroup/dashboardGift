import { renameKeys } from '@alycecom/utils';

import { setLoading } from '../../../../helpers/lens.helpers';

import { MEMBERS_LOAD_REQUEST, MEMBERS_LOAD_SUCCESS, MEMBERS_LOAD_FAILS } from './members.types';

export const initialState = {
  members: [],
  isLoading: false,
  error: null,
};

export const renameMemberKeys = renameKeys({
  full_name: 'fullName',
});

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MEMBERS_LOAD_REQUEST:
      return {
        ...state,
        ...setLoading(true, state),
      };
    case MEMBERS_LOAD_SUCCESS:
      return {
        ...initialState,
        ...setLoading(false, state),
        members: action.payload.map(member => renameMemberKeys(member)),
      };
    case MEMBERS_LOAD_FAILS:
      return {
        ...initialState,
        ...setLoading(false, state),
        error: action.payload,
      };
    default:
      return state;
  }
};
