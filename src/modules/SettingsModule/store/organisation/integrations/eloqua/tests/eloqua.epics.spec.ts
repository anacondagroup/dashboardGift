import { TestScheduler } from 'rxjs/testing';

import {
  ApiServiceMock,
  IEpicParams,
  setupEpicRunner,
  TEpicRunner,
  TMarbleValues,
} from '../../../../../../../testHelpers/epicRunner';
import { organisationEloquaIntegrationInfoEpic } from '../eloqua.epics';
import {
  organisationEloquaIntegrationInfoCheckRequest,
  organisationEloquaIntegrationInfoCheckSuccess,
} from '../eloqua.actions';

describe('eloquaEpics', () => {
  let testScheduler: TestScheduler;
  let ApiService: ApiServiceMock;
  let runEpic: TEpicRunner;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    const utils = setupEpicRunner(testScheduler);
    ApiService = utils.ApiService;
    runEpic = utils.runEpic;
  });

  describe('organisationEloquaIntegrationInfoEpic', () => {
    const runOrganisationEloquaIntegrationCheckStatusEpic = (
      epicParams: IEpicParams,
      expectedMarble: string,
      marbleValues: TMarbleValues,
    ) => {
      runEpic(organisationEloquaIntegrationInfoEpic, epicParams, expectedMarble, marbleValues);
    };
    it('produces correct actions (success)', () => {
      const action = organisationEloquaIntegrationInfoCheckRequest();
      const response = [
        {
          uuid: 'some nice uuid',
          eloquaSiteId: 7,
          eloquaSiteName: 'nice name',
          eloquaUserId: 7,
          eloquaUserName: 'my username',
        },
      ];
      const dependencies = {
        apiGateway: {
          get: ApiService.get('a', { a: response }),
        },
      };
      // @ts-ignore
      runOrganisationEloquaIntegrationCheckStatusEpic({ action, dependencies }, '-b', {
        b: organisationEloquaIntegrationInfoCheckSuccess(response[0]),
      });
    });
  });
});
