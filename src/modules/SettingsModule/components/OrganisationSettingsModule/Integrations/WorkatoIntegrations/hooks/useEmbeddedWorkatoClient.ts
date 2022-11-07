import { useCallback, useState } from 'react';
import { useInterval } from 'react-use';

const formWorkatoEmbeddedUrl = (integrationId: string): string => `Workato.configure({
      embeddingUrlPrefix: '/settings/organization/integrations/${integrationId}/logs',
    });`;

export const useEmbeddedWorkatoClient = (integrationId: string): HTMLScriptElement | null => {
  const [scriptRef, setScriptRef] = useState<HTMLScriptElement | null>(null);

  const insertScript = useCallback(() => {
    const script = document.createElement('script');
    script.async = false;

    script.innerHTML = formWorkatoEmbeddedUrl(integrationId);

    setScriptRef(script);

    document.head.appendChild(script);
  }, [integrationId]);

  useInterval(
    () => {
      insertScript();
    },
    scriptRef ? null : 3000,
  );
  return scriptRef;
};
