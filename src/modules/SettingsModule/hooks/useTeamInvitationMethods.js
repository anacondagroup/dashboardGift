import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  giftInvitationMethodsLoadRequest,
  giftInvitationMethodsUpdateRequest,
} from '../store/teams/invitationMethods/invitationMethods.actions';
import {
  getInvitationMethods,
  getSelectedInvitationMethodNames,
  getInvitationMethodsIsLoading,
} from '../store/teams/invitationMethods/invitationMethods.selectors';

export default teamId => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(giftInvitationMethodsLoadRequest(teamId));
  }, [dispatch, teamId]);

  const setRestrictedInvitationTypes = useCallback(
    restrictedTypesIds => {
      dispatch(giftInvitationMethodsUpdateRequest(teamId, restrictedTypesIds));
    },
    [dispatch, teamId],
  );

  const invitationMethods = useSelector(getInvitationMethods);
  const invitationMethodsNames = useSelector(getSelectedInvitationMethodNames);
  const invitationMethodsIsLoading = useSelector(getInvitationMethodsIsLoading);

  return [invitationMethods, invitationMethodsNames, invitationMethodsIsLoading, setRestrictedInvitationTypes];
};
