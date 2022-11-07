export interface IOAuthStateResponse {
  state: ConnectionState;
  message: string | null;
  connectedBy: string | null;
  connectedAt: string | null;
}

export interface OAuthConnectionEvent {
  state: ConnectionState;
  message: string;
}

export interface IOAuthLinkResponse {
  link: string;
}

export enum ConnectionState {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Error = 'error',
}

// That's new connection status enum which is applicable to any SF package version
export type TSfConnectionState = 'connected' | 'disconnected';

export type TSfConnectionStateResponse = { state: TSfConnectionState };
