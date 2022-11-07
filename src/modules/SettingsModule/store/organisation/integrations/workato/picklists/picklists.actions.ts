import { createAsyncAction } from '@alycecom/utils';

import { IWorkatoPicklist } from '../workato.types';

const prefix = 'SETTINGS_MODULE/WORKATO/PICKLIST';

interface IWorkatoPicklistPayload {
  connectionUuid: string;
  picklistName: string;
}

export const fetchWorkatoPicklistByConnection = createAsyncAction<
  IWorkatoPicklistPayload,
  { data: IWorkatoPicklist[]; name: string },
  void
>(`${prefix}/FETCH_PICKLIST`);
