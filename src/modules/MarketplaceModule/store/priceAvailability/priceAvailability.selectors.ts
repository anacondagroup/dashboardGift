import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const getPriceAvailabilityState = (state: IRootState) => state.marketplace.priceAvailability;

export const getIsLoading = pipe(getPriceAvailabilityState, state => state.status === StateStatus.Pending);
export const getPriceAvailability = pipe(getPriceAvailabilityState, state => state.data);
