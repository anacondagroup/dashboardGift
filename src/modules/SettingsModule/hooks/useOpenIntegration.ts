import { useCallback } from 'react';
import { useRouting } from '@alycecom/hooks';

export const useOpenIntegration = (url: string): ((type: string, uuid?: string) => void) => {
  const go = useRouting();

  return useCallback(
    (type: string, uuid?: string) => {
      const forwardUrl = uuid ? `${url}/${type}/${uuid}` : `${url}/${type}`;
      go(forwardUrl);
    },
    [go, url],
  );
};
