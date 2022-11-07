import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  makeGetConnectionStatusByUuid,
  makeGetConnectionUuidByProvider,
} from '../store/organisation/integrations/workato/connections/connections.selectors';
import { fetchWorkatoPicklistByConnection } from '../store/organisation/integrations/workato/picklists/picklists.actions';
import { Picklists } from '../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoPicklist, WorkatoConnectionStatus } from '../store/organisation/integrations/workato/workato.types';
import { makeGetPicklist } from '../store/organisation/integrations/workato/picklists/picklists.selectors';

const PicklistProviderHashMap = {
  [Picklists.GetConversationPicklist]: 'slack',
  [Picklists.GiftEvents]: 'alyce',
  [Picklists.CampaignMemberStatus]: 'salesforce',
};

export const useWorkatoPicklist = (picklistName: Picklists): IWorkatoPicklist[] => {
  const dispatch = useDispatch();

  const picklist = useSelector(useMemo(() => makeGetPicklist(picklistName), [picklistName]));

  const connectionUuid = useSelector(
    useMemo(() => makeGetConnectionUuidByProvider(PicklistProviderHashMap[picklistName]), [picklistName]),
  );

  const connectionStatusByUuid = useSelector(
    useMemo(() => makeGetConnectionStatusByUuid(connectionUuid), [connectionUuid]),
  );

  useEffect(() => {
    if (connectionUuid && connectionStatusByUuid === WorkatoConnectionStatus.Success) {
      dispatch(fetchWorkatoPicklistByConnection({ connectionUuid, picklistName }));
    }
  }, [connectionStatusByUuid, connectionUuid, dispatch, picklistName]);

  return picklist;
};
