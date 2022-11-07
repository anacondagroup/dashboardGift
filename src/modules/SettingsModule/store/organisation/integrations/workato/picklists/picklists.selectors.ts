import { createSelector, OutputSelector } from 'reselect';

import { IRootState } from '../../../../../../../store/root.types';
import { IWorkatoPicklist } from '../workato.types';

import { IPicklistsState } from './picklists.reducer';

const getWorkatoPicklistsState = (state: IRootState): IPicklistsState =>
  state.settings.organisation.integrations.workato.picklists;

export const makeGetPicklist = (
  picklistName: string,
): OutputSelector<IRootState, IWorkatoPicklist[], (res: IPicklistsState) => IWorkatoPicklist[]> =>
  createSelector(getWorkatoPicklistsState, picklists => {
    if (Object.keys(picklists).includes(picklistName)) return picklists[picklistName];
    return [];
  });
