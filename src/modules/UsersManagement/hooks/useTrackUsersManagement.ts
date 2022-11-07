import { useEffect } from 'react';
import { TrackEvent } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { User } from '@alycecom/modules';

import { getIsFileRejected } from '../store/bulkCreate/bulkCreate.selectors';
import { getUsersMeta } from '../store/users/users.selectors';

export const useTrackUsersManagementPageVisited = (): void => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);
  useEffect(() => {
    trackEvent('Users Management — Visited', payload, options);
  }, [trackEvent, payload, options]);
};

export const useTrackUsersManagementPendingInvitationsNotificationVisible = (): void => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const usersMeta = useSelector(getUsersMeta);
  useEffect(() => {
    if (usersMeta.pendingInvitationUsers.length > 0) {
      trackEvent('Pending user invitations — viewed', { numberOfUsers: usersMeta.pendingInvitationUsers.length });
    }
  }, [trackEvent, usersMeta]);
};

export const useTrackFileValidationError = (): void => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);
  const isFileRejected = useSelector(getIsFileRejected);

  useEffect(() => {
    if (isFileRejected) {
      trackEvent('Bulk Invite — File Upload Error', payload, options);
    }
  }, [trackEvent, payload, options, isFileRejected]);
};
