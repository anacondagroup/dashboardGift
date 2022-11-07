import { TrackEvent } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { Auth, User } from '@alycecom/modules';
import { useMemo, useEffect, useState } from 'react';

import { tabsKeys } from '../constants/sidebarTabs.constants';
import { getBulkImportStatus, getBulkImportTotalContacts } from '../store/bulkCreateContacts/import/import.selectors';

export const useTrackSidebarOptions = () => {
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const orgId = useSelector(User.selectors.getOrgId);
  const orgName = useSelector(User.selectors.getOrgName);

  return useMemo(
    () => [
      { adminId },
      {
        groupId: orgId,
        traits: {
          adminId,
          orgId,
          orgName,
        },
      },
    ],
    [adminId, orgId, orgName],
  );
};

export const useTrackBulkSidebarEffect = isBulkSidebarOpen => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useTrackSidebarOptions();

  useEffect(() => {
    if (isBulkSidebarOpen) {
      trackEvent(
        'Sidebar — opened',
        {
          ...payload,
          tab: 'bulk-import',
          giftId: null,
        },
        options,
      );
    }
  }, [isBulkSidebarOpen, trackEvent, options, payload]);
};

export const useTrackAddContactSidebarEffect = isAddContactSidebarOpen => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useTrackSidebarOptions();

  useEffect(() => {
    if (isAddContactSidebarOpen) {
      trackEvent(
        'Sidebar — opened',
        {
          ...payload,
          tab: 'one-off',
          giftId: null,
        },
        options,
      );
    }
  }, [isAddContactSidebarOpen, trackEvent, options, payload]);
};

export const useTrackGiftingSidebarEffect = (tab, giftId = null) => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useTrackSidebarOptions();

  useEffect(() => {
    const tabs = {
      [tabsKeys.HISTORY]: 'history',
      [tabsKeys.PROFILE]: 'contact',
    };

    const currentTab = tabs[tab];
    if (currentTab) {
      trackEvent(
        'Sidebar — opened',
        {
          ...payload,
          tab: currentTab,
          giftId,
        },
        options,
      );
    }
  }, [giftId, options, payload, tab, trackEvent]);
};

export const useTrackBulkSubmittedEffect = (researchSetting = '') => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [payload, options] = useTrackSidebarOptions();
  const status = useSelector(getBulkImportStatus);
  const contactsLength = useSelector(getBulkImportTotalContacts);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    if (status === 'awaiting' && !isTracked) {
      trackEvent(
        'Contact — submitted',
        {
          ...payload,
          method: 'bulk',
          contactsLength,
          researchSetting,
        },
        options,
      );

      setIsTracked(true);
    }
  }, [contactsLength, isTracked, options, payload, researchSetting, status, trackEvent]);
};
