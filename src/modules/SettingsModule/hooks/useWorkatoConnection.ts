import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  TIntegrationUrlParams,
  WorkatoConnectionStatus,
  WorkatoMessageType,
  workatoWidgetPadding,
} from '../store/organisation/integrations/workato/workato.types';
import { handleConnectionStatusChange } from '../store/organisation/integrations/workato/connections/connections.actions';
import { makeGetConnectionStatusById } from '../store/organisation/integrations/workato/connections/connections.selectors';
import { WorkatoIntegrationContents } from '../components/OrganisationSettingsModule/Integrations/WorkatoIntegrations/IntegrationsContents';

import { useWorkatoTrackEvent } from './useWorkatoTrackEvent';

export const useWorkatoConnection = (
  connectionId: string,
): {
  hideFrame: boolean;
  calculatedFrameHeight: string;
} => {
  const dispatch = useDispatch();
  const { integrationId } = useParams<TIntegrationUrlParams>();

  const [hideFrame, setHideFrame] = useState(true);
  // todo figure out solution for height
  const [calculatedFrameHeight, setCalculatedFrameHeight] = useState('100%');

  const connectionStatusById = useSelector(useMemo(() => makeGetConnectionStatusById(connectionId), [connectionId]));

  const integrationTitle = integrationId ? WorkatoIntegrationContents[integrationId].title : '';
  const trackEvent = useWorkatoTrackEvent();

  const sendTrackEventMessage = useCallback(
    (isConnected: boolean) => {
      if (connectionStatusById === WorkatoConnectionStatus.Success && !isConnected) {
        trackEvent(`Workato - ${integrationTitle} - Disconnected integration`);
      }
      if (connectionStatusById === null && isConnected) {
        trackEvent(`Workato - ${integrationTitle} - Connected integration`);
      }
    },
    [connectionStatusById, integrationTitle, trackEvent],
  );

  const workatoMessageHandler = useCallback(
    (event: MessageEvent): void => {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      switch (data.type) {
        case WorkatoMessageType.HeightChange:
          setCalculatedFrameHeight(data.payload.height + 2 * workatoWidgetPadding);
          break;
        case WorkatoMessageType.ConnectionStatusChange:
          setHideFrame(false);
          if (connectionId === data.payload.id) {
            sendTrackEventMessage(data.payload.connected);
            dispatch(
              handleConnectionStatusChange({
                status: data.payload.connected ? WorkatoConnectionStatus.Success : null,
                connectionId,
              }),
            );
          }
          break;
        case WorkatoMessageType.Error:
          // todo handle error somehow?
          break;
        default:
          break;
      }
    },
    [connectionId, dispatch, sendTrackEventMessage],
  );

  useEffect(() => {
    window.addEventListener('message', workatoMessageHandler);
    return () => window.removeEventListener('message', workatoMessageHandler);
  }, [workatoMessageHandler]);

  return { hideFrame, calculatedFrameHeight };
};
