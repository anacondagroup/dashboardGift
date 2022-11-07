import { EntityId, TDictionary } from '@alycecom/utils';
import { VirtualGiftInvitationMethod } from '@alycecom/modules';

import { IGiftInvitationMethod } from './invitationMethods.types';

interface IGiftInvitationUpdate {
  id: EntityId;
  changes: Partial<IGiftInvitationMethod>;
}

export const getGiftInvitationMethodsUpdates = (
  restrictedMethodIds: number[],
  giftInvitationMethods: TDictionary<IGiftInvitationMethod>,
): IGiftInvitationUpdate[] =>
  Object.keys(giftInvitationMethods).map(id => ({
    id: giftInvitationMethods[id].id,
    changes: { restrictedByCampaign: restrictedMethodIds.includes(giftInvitationMethods[id].id) },
  }));

export const getIsInvitationMethodPermitted = (method: IGiftInvitationMethod): boolean =>
  !method.blockedByTeam && !method.restrictedByCampaign && method.allowedForCountries;

export const getIsVirtualInvitationMethod = (id: VirtualGiftInvitationMethod): boolean =>
  [VirtualGiftInvitationMethod.email, VirtualGiftInvitationMethod.link].includes(id);
