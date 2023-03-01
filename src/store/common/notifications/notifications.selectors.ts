import { pipe } from 'ramda';

import { IRootState } from '../../root.types';

const getPermissionsState = (state: IRootState) => state.common.notifications;
export const getShowNotificationStatus = pipe(getPermissionsState);
