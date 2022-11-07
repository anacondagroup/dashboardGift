import React, { useMemo, useCallback } from 'react';
import { Icon, IconProp } from '@alycecom/ui';
import { TrackEvent } from '@alycecom/services';
import { Tabs, Tab } from '@mui/material';

import { tabsKeys } from '../../../../constants/sidebarTabs.constants';

const styles = {
  tab: {
    height: 42,
    color: 'link.main',
    minWidth: 130,
  },
  selectedTab: {
    color: 'primary.main',
  },
  notSelectedIcon: {
    color: 'link.main',
  },
  tabIcon: {
    fontSize: 16,
    mr: 1,
  },
} as const;

export type TTabItem = keyof typeof tabsKeys;

export interface ISidebarTabsProps {
  selectedTab: TTabItem;
  onChangeTab: (tab: TTabItem) => void;
  showGiftCreate: boolean;
  disabled: boolean;
}

const SidebarTabs = ({ selectedTab, onChangeTab, showGiftCreate, disabled }: ISidebarTabsProps): JSX.Element => {
  const tabs = useMemo(
    () => [
      {
        value: tabsKeys.PROFILE,
        isActive: tabsKeys.PROFILE === selectedTab,
        icon: 'flask',
        label: 'About',
      },
      {
        value: tabsKeys.HISTORY,
        isActive: tabsKeys.HISTORY === selectedTab,
        icon: 'history',
        label: 'History',
      },
      ...(showGiftCreate
        ? [
            {
              value: tabsKeys.SEND_GIFT,
              isActive: tabsKeys.SEND_GIFT === selectedTab,
              icon: 'gift',
              label: 'Send gift',
            },
          ]
        : []),
    ],
    [selectedTab, showGiftCreate],
  );

  const { trackEvent } = TrackEvent.useTrackEvent();
  const changeTabHandler = useCallback(
    (event, tabValue) => {
      onChangeTab(tabValue);
      trackEvent(`Gifting flow — clicked contact ${tabValue} tab`);
    },
    [onChangeTab, trackEvent],
  );

  const activeTab = useMemo(() => (tabs.find(tab => tab.value === selectedTab) ? selectedTab : tabs[0].value), [
    selectedTab,
    tabs,
  ]);

  return (
    <Tabs indicatorColor="primary" variant="fullWidth" value={activeTab} onChange={changeTabHandler}>
      {tabs.map(tab => (
        <Tab
          key={tab.value}
          value={tab.value}
          disabled={disabled}
          label={
            <>
              <Icon
                icon={tab.icon as IconProp}
                sx={[styles.tabIcon, tab.isActive ? styles.selectedTab : styles.notSelectedIcon]}
              />
              {tab.label}
            </>
          }
          sx={styles.tab}
        />
      ))}
    </Tabs>
  );
};

export default SidebarTabs;
