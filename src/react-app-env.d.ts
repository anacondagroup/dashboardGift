/// <reference types="react-scripts" />

interface IRollbarConfig {
  payload: unknown;
  transform?: (obj: Record<string, unknown>) => Record<string, unknown>;
}

interface Window {
  APP_CONFIG: {
    workatoAppHost: string;
    hubspotAppHost: string;
    environment: string;
    vidyardClientId: string;
    apiHost: string;
    gatewayHost: string;
    dashboardHost: string;
    tokenName: string;
    refreshTokenName: string;
    rollbarAccessToken: string;
    codeVersion: string;
  };
  Rollbar?: {
    configure: (config: IRollbarConfig) => void;
  };
  Workato: {
    currentWorkatoUrl: string;
    loaded: boolean;
    navigateTo: (url: string) => unknown;
    constructEmbeddingUrl: (workatoUrl: string) => string;
    extractWorkatoUrl: (alyceUrl: string) => string | null;
    generateIFrameUrl: (token: string, workatoUrl: string | null) => string;
    disableNavigationHandling: () => void;
  };
  Appcues?: {
    loadLaunchpad: (elementId: string, config: unknown) => void;
  };
}
