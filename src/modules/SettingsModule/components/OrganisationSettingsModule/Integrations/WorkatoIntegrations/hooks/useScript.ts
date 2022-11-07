import { useEffect } from 'react';

export const useScript = (src?: string, innerHtml?: string): void => {
  useEffect(() => {
    const script = document.createElement('script');

    script.async = false;

    if (src) {
      script.src = src;
    }

    if (innerHtml) {
      script.innerHTML = innerHtml;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [innerHtml, src]);
};
