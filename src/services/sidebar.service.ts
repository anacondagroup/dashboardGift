import { CreateGift } from '@alycecom/modules';
import { SetUrlQuery } from '@alycecom/hooks';

import { tabsKeys } from '../constants/sidebarTabs.constants';

const { giftStatuses } = CreateGift.constants;

type TGiftInfo = {
  giftId: number;
  contactId: number;
  giftStatusId: typeof giftStatuses[keyof typeof giftStatuses];
};

export const openSidebarTab = (
  updateUrlFunc: SetUrlQuery<unknown>,
  giftInfo: TGiftInfo,
  tab: string | null = null,
): void => {
  let sidebarTab = tab || tabsKeys.SEND_GIFT;
  if (!tab) {
    if (giftInfo.giftStatusId && giftInfo.giftStatusId === giftStatuses.NEED_MORE_INFO) {
      sidebarTab = tabsKeys.PROFILE;
    }
  }
  updateUrlFunc({ ...giftInfo, sidebarTab });
};
