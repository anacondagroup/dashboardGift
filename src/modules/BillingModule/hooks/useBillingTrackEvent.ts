import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Auth, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';

import { getOrg } from '../store/customerOrg';

export const useBillingTrackEvent = (): ((name: string, payload?: Record<string, unknown>) => void) => {
  const { id: orgId } = useSelector(getOrg);
  const userId = useSelector(User.selectors.getUserId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);

  const { trackEvent } = TrackEvent.useTrackEvent();

  return useCallback(
    (name, payload = {}) => {
      trackEvent(name, { userId, orgId, ...payload }, { traits: { adminId }, groupId: orgId });
    },
    [adminId, orgId, trackEvent, userId],
  );
};
