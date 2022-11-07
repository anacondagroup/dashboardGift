import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { profileLoadRequest } from '../store/contact/profile/profile.actions';
import { getProfile } from '../store/contact/profile/profile.selectors';

export default contactId => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileLoadRequest({ contactId }));
  }, [contactId, dispatch]);

  const profile = useSelector(getProfile);

  return [profile];
};
