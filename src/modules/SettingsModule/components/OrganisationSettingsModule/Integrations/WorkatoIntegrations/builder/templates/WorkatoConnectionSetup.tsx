import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccordionDetails, Box, CircularProgress } from '@mui/material';

import {
  connectionsQuantityForDynamicFrameHeight,
  fixedFrameHeight,
  IWorkatoConnection,
  workatoWidgetPadding,
} from '../../../../../../store/organisation/integrations/workato/workato.types';
import { useWorkatoConnection } from '../../../../../../hooks/useWorkatoConnection';
import {
  makeGetIsLoadingTokenByConnectionIdentifier,
  makeGetTokenByConnectionIdentifier,
} from '../../../../../../store/organisation/integrations/workato/oauth/oauth.selectors';
import {
  clearWorkatoIntegrationToken,
  fetchWorkatoIntegrationToken,
} from '../../../../../../store/organisation/integrations/workato/oauth/oauth.actions';

interface WorkatoConnectionIframeProps {
  connection: IWorkatoConnection;
  heightFactor: number;
}

export const WorkatoConnectionSetup = ({ connection, heightFactor }: WorkatoConnectionIframeProps): JSX.Element => {
  const dispatch = useDispatch();

  const { workatoConnectionId: connectionId } = connection;

  const token = useSelector(useMemo(() => makeGetTokenByConnectionIdentifier(connectionId), [connectionId]));
  const isLoadingToken = useSelector(
    useMemo(() => makeGetIsLoadingTokenByConnectionIdentifier(connectionId), [connectionId]),
  );

  const { hideFrame, calculatedFrameHeight } = useWorkatoConnection(connectionId);
  const isLoadingConnectionIframe = hideFrame || isLoadingToken;

  useEffect(() => {
    dispatch(fetchWorkatoIntegrationToken({ connectionId }));

    return () => {
      dispatch(clearWorkatoIntegrationToken({ connectionId }));
    };
  }, [connectionId, dispatch]);

  const height = heightFactor === connectionsQuantityForDynamicFrameHeight ? calculatedFrameHeight : fixedFrameHeight;

  return (
    <AccordionDetails>
      <Box width="100%">
        {isLoadingConnectionIframe && (
          <Box width="100%" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {token && connection.workatoConnectionId && (
          <iframe
            title={`Establishing connection (${connection.workatoConnectionId})`}
            id={connection.workatoConnectionId}
            style={{
              display: hideFrame ? 'none' : 'block',
              width: '100%',
              height,
              padding: workatoWidgetPadding,
              border: 'none',
            }}
            src={`${window.APP_CONFIG.workatoAppHost}/direct_link/embedded/connections/${connection.workatoConnectionId}?workato_dl_token=${token}`}
          />
        )}
      </Box>
    </AccordionDetails>
  );
};
