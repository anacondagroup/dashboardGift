import { useSelector } from 'react-redux';
import { Auth, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { useCallback, useMemo } from 'react';

import { ForgottenChoice } from '../../../store/organisation/rightToBeForgotten/rightToBeForgotten.types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useTrackRightToBeForgottenPayload = () => {
  const orgId = useSelector(User.selectors.getOrgId);
  const orgName = useSelector(User.selectors.getOrgName);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);

  return useMemo(
    () => [
      { adminId },
      {
        groupId: orgId,
        traits: { adminId, orgId, orgName },
      },
    ],
    [orgId, adminId, orgName],
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTrackRightToBeForgottenRequested = () => {
  const [payload, options] = useTrackRightToBeForgottenPayload();
  const { trackEvent } = TrackEvent.useTrackEvent();

  return useCallback(
    (choice: ForgottenChoice) => {
      trackEvent('Right to be forgotten — requested', { ...payload, choice }, options);
    },
    [payload, options, trackEvent],
  );
};
