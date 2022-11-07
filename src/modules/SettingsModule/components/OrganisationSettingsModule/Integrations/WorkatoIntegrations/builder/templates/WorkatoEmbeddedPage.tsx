import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { workatoWidgetPadding } from '../../../../../../store/organisation/integrations/workato/workato.types';
import DashboardLayout from '../../../../../../../../components/Dashboard/Shared/DashboardLayout';
import { useScript } from '../../hooks/useScript';
import { useEmbeddedWorkatoClient } from '../../hooks/useEmbeddedWorkatoClient';
import {
  getIsLoadingWorkatoEmbeddingToken,
  getWorkatoEmbeddingToken,
} from '../../../../../../store/organisation/integrations/workato/embedding/embedding.selectors';
import { fetchWorkatoEmbeddingToken } from '../../../../../../store/organisation/integrations/workato/embedding/embedding.actions';

import { IntegrationLayout } from './IntegrationLayout';
import SectionLoader from './SectionLoader';

interface IWorkatoEmbeddedPageProps {
  integrationId: string;
}

export const WorkatoEmbeddedPage = ({ integrationId }: IWorkatoEmbeddedPageProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const { Workato } = window;
  const location = useLocation();
  const [iframeSrc, setIframeSrc] = useState<string>('');

  const embeddingToken = useSelector(getWorkatoEmbeddingToken);
  const isLoadingEmbeddingToken = useSelector(getIsLoadingWorkatoEmbeddingToken);

  useScript('https://embedding.workato.com/r/embedding-client.js');
  const hasAppendedLoadingScript = useEmbeddedWorkatoClient(integrationId);

  useEffect(() => {
    dispatch(fetchWorkatoEmbeddingToken());
  }, [dispatch]);

  useEffect(() => {
    if (Workato && embeddingToken && hasAppendedLoadingScript) {
      const updateIframeSrc = (embeddingUrl: string, token: string) => {
        const workatoEmbeddedUrl = Workato.extractWorkatoUrl(embeddingUrl);
        if (workatoEmbeddedUrl) {
          setIframeSrc(Workato.generateIFrameUrl(token, workatoEmbeddedUrl));
          Workato.navigateTo(workatoEmbeddedUrl);
        }
      };

      updateIframeSrc(location.pathname + location.hash, embeddingToken);

      return () => {
        Workato.disableNavigationHandling();
      };
    }
    return undefined;
  }, [Workato, embeddingToken, hasAppendedLoadingScript, location]);

  const isLoadingEmbeddingIframe = isLoadingEmbeddingToken || !iframeSrc;

  return (
    <DashboardLayout>
      <IntegrationLayout integrationId={integrationId}>
        <SectionLoader isLoading={isLoadingEmbeddingIframe}>
          <iframe
            title="Workato Embedded Page"
            src={iframeSrc}
            style={{
              width: '100%',
              height: '100vh',
              padding: workatoWidgetPadding,
              border: 'none',
            }}
          />
        </SectionLoader>
      </IntegrationLayout>
    </DashboardLayout>
  );
};
