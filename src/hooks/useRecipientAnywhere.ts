import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { CreateGift } from '@alycecom/modules';

import { getProfile } from '../store/contact/profile/profile.selectors';
import { IGiftRecipient, IProfile } from '../store/contact/profile/profileCompatibility.types';

export const useRecipientAnywhere = (): Partial<IProfile & { company: string }> => {
  const unsignedRecipient = useSelector(CreateGift.selectors.getRecipient);
  const giftRecipient = useSelector(CreateGift.selectors.getGiftRecipient) as IGiftRecipient;
  const profile = useSelector(getProfile) as IProfile;

  const unsignedRecipientId = R.pathOr(null, ['recipient', 'id'], unsignedRecipient);
  const giftRecipientId = R.propOr(null, 'id', giftRecipient);

  return useMemo(() => {
    if (unsignedRecipientId) {
      return {
        id: null,
        fullName: `${unsignedRecipient.recipient.first_name} ${unsignedRecipient.recipient.last_name}`,
        firstName: unsignedRecipient.recipient.first_name,
        lastName: unsignedRecipient.recipient.last_name,
        email: unsignedRecipient.recipient.email,
        employment: unsignedRecipient.recipient.employment,
        company: unsignedRecipient.recipient.company,
        avatar: unsignedRecipient.recipient.avatar,
      };
    }

    if (profile && profile.email) {
      return profile;
    }

    if (giftRecipientId) {
      return {
        id: giftRecipient.id,
        firstName: giftRecipient.first_name,
        lastName: giftRecipient.last_name,
        email: giftRecipient.email,
        fullName: giftRecipient.full_name,
        employment: giftRecipient.employment,
        company: giftRecipient.company,
        avatar: giftRecipient.avatar,
      };
    }

    return {
      id: null,
      fullName: '',
      firstName: '',
      lastName: '',
      employment: '',
      email: '',
      company: '',
      avatar: undefined,
    };
  }, [unsignedRecipientId, giftRecipientId, unsignedRecipient, profile, giftRecipient]);
};
