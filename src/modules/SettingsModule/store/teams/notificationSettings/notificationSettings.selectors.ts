import { prop, pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToSettings = (state: IRootState) => state.settings.teams.notificationSettings;

export const getIsAdminNotify = pipe(pathToSettings, prop('isAdminNotify'));

export const getIsSenderNotify = pipe(pathToSettings, prop('isSenderNotify'));

export const getAdminNotifyOption = pipe(pathToSettings, prop('adminNotifyOption'));

export const getSenderNotifyOption = pipe(pathToSettings, prop('senderNotifyOption'));
