import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { AlyceLoading } from '@alycecom/ui';

import useContactById from '../../hooks/useContactById';
import { tabsKeys } from '../../constants/sidebarTabs.constants';

const SendGiftRedirect = ({ contactId }) => {
  const [contact] = useContactById(contactId);
  const redirectUrl = useMemo(() => {
    if (!contact || !contact.id) {
      return '';
    }
    let sidebarTab = tabsKeys.SEND_GIFT;
    if (contact.latestGift && contact.latestGift.statusId === 15) sidebarTab = tabsKeys.PROFILE;
    return `/teams?contact_id=${contact.id}&sidebar_tab=${sidebarTab}`;
  }, [contact]);
  return redirectUrl ? <Redirect to={redirectUrl} /> : <AlyceLoading isLoading />;
};

SendGiftRedirect.propTypes = {
  contactId: PropTypes.string.isRequired,
};

export default SendGiftRedirect;
