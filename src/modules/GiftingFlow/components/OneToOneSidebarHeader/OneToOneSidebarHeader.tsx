import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Paper, Theme } from '@mui/material';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import { useRecipientAnywhere } from '../../../../hooks/useRecipientAnywhere';
import { getProfile, getProfileIsLoading } from '../../../../store/contact/profile/profile.selectors';
import SidebarTabs, { TTabItem } from '../SidebarTabs/SidebarTabs';
import { IProfile } from '../../../../store/contact/profile/profileCompatibility.types';

import ContactDetailsHeader from './ContactDetailsHeader';
import SendGiftHeader from './SendGiftHeader';

const styles = {
  paperBorder: {
    borderBottom: ({ palette }: Theme) => `1px solid ${palette.divider}`,
  },
} as const;

export interface IOneToOneSidebarHeaderProps {
  isTabsVisible: boolean;
  onClose: () => void;
}

const OneToOneSidebarHeader = ({ isTabsVisible, onClose }: IOneToOneSidebarHeaderProps): JSX.Element => {
  const { sidebarTab = '', contactId } = useUrlQuery(['sidebarTab', 'contactId']);
  const updateUrlFunc = useSetUrlQuery();

  const recipient = useRecipientAnywhere();
  const isLoading = useSelector(getProfileIsLoading) as boolean;
  const profile = useSelector(getProfile) as IProfile;
  const showGiftCreateTab = isLoading || !profile.isUnsubscribed;
  const disableSideBarTabs = isLoading || !profile.email;

  const onChangeTab = useCallback(
    tab => {
      updateUrlFunc({ sidebarTab: tab });
    },
    [updateUrlFunc],
  );

  if (!contactId) {
    return <SendGiftHeader onClose={onClose} />;
  }

  return (
    <>
      <ContactDetailsHeader
        isLoading={isLoading}
        fullName={recipient.fullName}
        position={`${recipient.employment ? `${recipient.employment} @ ` : ''}${recipient?.company}`}
        avatar={recipient.avatar}
        onClose={onClose}
      />
      {isTabsVisible && (
        <Paper square sx={styles.paperBorder}>
          <SidebarTabs
            showGiftCreate={showGiftCreateTab}
            selectedTab={sidebarTab as TTabItem}
            disabled={disableSideBarTabs}
            onChangeTab={onChangeTab}
          />
        </Paper>
      )}
    </>
  );
};

export default OneToOneSidebarHeader;
