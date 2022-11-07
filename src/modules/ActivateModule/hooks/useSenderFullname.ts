import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CampaignSettings, Features, User } from '@alycecom/modules';

import { getOwnerId, getSendAsIdValue } from '../store/steps/details';

export const useSenderFullname = (): string => {
  const userFullName = useSelector(User.selectors.getUserFullName);
  const userId = useSelector(User.selectors.getUserId);
  const sendAsId = useSelector(getSendAsIdValue);
  const ownerId = useSelector(getOwnerId);
  const sendAs = useSelector(
    useMemo(() => (sendAsId ? CampaignSettings.selectors.getTeamMemberById(sendAsId) : () => null), [sendAsId]),
  );
  const owner = useSelector(
    useMemo(() => (ownerId ? CampaignSettings.selectors.getTeamMemberById(ownerId) : () => null), [ownerId]),
  );

  const isMultipleSendAsEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.MULTIPLE_GIFT_LINKS), []),
  );

  if (isMultipleSendAsEnabled) {
    return sendAs && userId !== sendAsId ? `${sendAs.firstName} ${sendAs.lastName}` : userFullName;
  }

  if (owner) {
    return `${owner.firstName} ${owner.lastName}`;
  }

  return '';
};
