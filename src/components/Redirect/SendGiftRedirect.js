import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { AlyceLoading } from '@alycecom/ui';
import { GlobalMessage } from '@alycecom/services';

import useGiftByHashId from '../../hooks/useGiftByHashId';

const SendGiftRedirect = ({ giftHashId }) => {
  const [gift, error] = useGiftByHashId(giftHashId);
  const { showGlobalMessage } = GlobalMessage.useGlobalMessage();

  const redirectUrl = useMemo(() => {
    if (gift) {
      return `/teams/?contact_id=${gift.contact_id}&gift_id=${gift.gift_id}&sidebar_tab=send-gift`;
    }
    if (error) {
      return '/';
    }

    return null;
  }, [gift, error]);
  useEffect(() => {
    if (error) {
      showGlobalMessage({
        text: `${error.status === 404 ? 'Gift not found' : 'Server error'}, redirecting to main page`,
        type: 'error',
      });
    }
  }, [showGlobalMessage, error]);
  return redirectUrl ? <Redirect to={redirectUrl} /> : <AlyceLoading isLoading />;
};

SendGiftRedirect.propTypes = {
  giftHashId: PropTypes.string.isRequired,
};

export default SendGiftRedirect;
