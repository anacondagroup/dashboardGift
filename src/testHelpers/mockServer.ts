import { matchRequestUrl, MockedRequest, RESTMethods } from 'msw';
import { SetupServerApi } from 'msw/node';
import { cleanup } from '@testing-library/react';
import { curry } from 'ramda';

type TUseMswServerReturnValue = {
  waitForRequest: (method: RESTMethods, url: string) => Promise<MockedRequest>;
};

export const useMswServer = (server: SetupServerApi): TUseMswServerReturnValue => {
  beforeAll(() => server.listen());

  beforeEach(() => jest.resetAllMocks());

  afterEach(() => {
    server.resetHandlers();
    cleanup();
  });

  afterAll(() => server.close());

  return {
    waitForRequest: curry(waitForRequest)(server),
  };
};

export const waitForRequest = (server: SetupServerApi, method: RESTMethods, url: string): Promise<MockedRequest> => {
  let requestId = '';
  return new Promise<MockedRequest>((resolve, reject) => {
    server.events.on('request:start', req => {
      const isMethodMatched = req.method.toLowerCase() === method.toLowerCase();
      const isUrlMatched = matchRequestUrl(req.url, url).matches;
      if (isMethodMatched && isUrlMatched) {
        requestId = req.id;
      }
    });
    server.events.on('request:match', req => {
      if (req.id === requestId) {
        resolve(req);
      }
    });
    server.events.on('request:unhandled', req => {
      if (req.id === requestId) {
        reject(new Error(`The ${req.method} ${req.url.href} request was unhandled.`));
      }
    });
  });
};
