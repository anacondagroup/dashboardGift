import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TrackEvent } from '@alycecom/services';
import { Auth, User } from '@alycecom/modules';

const useTrackGiftInvitationReportPayload = () => {
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const orgId = useSelector(User.selectors.getOrgId);
  const orgName = useSelector(User.selectors.getOrgName);

  return useMemo(
    () => [
      { adminId },
      {
        groupId: orgId,
        traits: { adminId, orgName, orgId },
      },
    ],
    [adminId, orgId, orgName],
  );
};

export const useTrackGiftInvitationReport = () => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useTrackGiftInvitationReportPayload();

  return useCallback(
    scope => {
      trackEvent('Gift invitation report — requested', { ...payload, scope }, options);
    },
    [payload, options, trackEvent],
  );
};
