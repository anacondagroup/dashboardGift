import { IActivate } from '../../activate.types';

import { defaultHeader, defaultMessage, defaultMetaHeader, defaultMetaDescription } from './messaging.constants';

export const transformMessagingData = (messaging: IActivate['messaging']): IActivate['messaging'] => ({
  ...messaging,
  expirePopUp: {
    header: messaging.expirePopUp?.header || defaultHeader,
    message: messaging.expirePopUp?.message || defaultMessage,
  },
  recipientMeta: {
    header: messaging.recipientMeta?.header || defaultMetaHeader,
    description: messaging.recipientMeta?.description || defaultMetaDescription,
  },
});
