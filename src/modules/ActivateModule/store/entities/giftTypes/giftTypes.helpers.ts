import { difference, union } from 'ramda';
import { EntityId } from '@alycecom/utils';

import { PHYSICAL_GIFT_TYPE_LIST } from '../../../constants/marketplaceSidebar.constants';

import { IGiftType, IOldGiftType } from './giftTypes.types';

export const getIsGiftBudgetBlocked = (
  restrictedGiftTypeIds: EntityId[],
  restrictedByTeamGiftTypeIds: EntityId[],
  unavailableGiftTypeIds: EntityId[],
): boolean =>
  difference(
    PHYSICAL_GIFT_TYPE_LIST,
    union(union(restrictedByTeamGiftTypeIds, restrictedGiftTypeIds), unavailableGiftTypeIds),
  ).length === 0;

export const transformOlgGiftTypeToGiftType = (oldGiftType: IOldGiftType): IGiftType => ({
  id: oldGiftType.id,
  name: oldGiftType.name,
  description: '',
  isTeamRestricted: oldGiftType.is_team_restricted,
  countryIds: oldGiftType.countryIds,
});
