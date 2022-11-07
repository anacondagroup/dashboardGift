import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getGiftByHashId, resetGift } from '../store/redirect/redirect.actions';
import { getGift, getError } from '../store/redirect/redirect.selectors';

export default giftHashId => {
  const dispatch = useDispatch();
  useEffect(() => {
    resetGift();
    dispatch(getGiftByHashId(giftHashId));
  }, [dispatch, giftHashId]);

  const gift = useSelector(getGift);
  const error = useSelector(getError);

  return [gift, error];
};
