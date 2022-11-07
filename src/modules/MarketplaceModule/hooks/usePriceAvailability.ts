import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPriceAvailability } from '../store/priceAvailability/priceAvailability.selectors';
import { getPriceAvailabilityRequest } from '../store/priceAvailability/priceAvailability.actions';
import { IPriceAvailability } from '../store/priceAvailability/priceAvailability.types';

export const usePriceAvailability = (campaignId: number): IPriceAvailability => {
  const dispatch = useDispatch();

  const data = useSelector(getPriceAvailability);

  useEffect(() => {
    if (campaignId) {
      dispatch(getPriceAvailabilityRequest({ campaignId }));
    }
  }, [dispatch, campaignId]);

  return data;
};
