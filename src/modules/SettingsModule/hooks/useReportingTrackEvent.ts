import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Auth, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';

export const useReportingTrackEvent = (): ((name: string, payload?: Record<string, unknown>) => void) => {
  const userId = useSelector(User.selectors.getUserId);
  const orgId = useSelector(User.selectors.getOrgId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);

  const { trackEvent } = TrackEvent.useTrackEvent();

  return useCallback(
    (name, payload = {}) => {
      trackEvent(name, { userId, orgId, ...payload }, { traits: { adminId }, groupId: orgId });
    },
    [adminId, orgId, trackEvent, userId],
  );
};
