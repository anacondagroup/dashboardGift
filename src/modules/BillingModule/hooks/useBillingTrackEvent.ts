import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Auth, User } from '@alycecom/modules';
import { TrackEvent, useGetOrganizationQuery } from '@alycecom/services';

export const useBillingTrackEvent = (): ((name: string, payload?: Record<string, unknown>) => void) => {
  const { data: organization } = useGetOrganizationQuery();
  const orgId = organization?.id;

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
