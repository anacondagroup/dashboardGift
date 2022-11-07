import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { contactsAvatarsLoadRequest } from '../store/breakdowns/contactsAvatars/contactsAvatars.actions';

export const useContactsAvatars = () => {
  const dispatch = useDispatch();

  const avatars = useSelector(state => state.dashboard.breakdowns.contactsAvatars.avatars);

  const loadAvatars = useCallback(ids => dispatch(contactsAvatarsLoadRequest(ids)), [dispatch]);

  const getAvatarById = useCallback(
    contactId => {
      const user = avatars.find(avatar => avatar.user_id === contactId);
      return user ? user.image_path : null;
    },
    [avatars],
  );

  return [getAvatarById, loadAvatars];
};
