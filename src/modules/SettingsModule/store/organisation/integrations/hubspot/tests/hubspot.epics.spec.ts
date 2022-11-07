import { TestScheduler } from 'rxjs/testing';
import {
  organisationHubspotIntegrationStatusCheckRequest,
  organisationHubspotIntegrationStatusCheckFail,
  organisationHubspotIntegrationStatusCheckSuccess,
} from '../hubspot.actions';
import { organisationHubspotIntegrationCheckStatusEpic } from '../hubspot.epics';
import {
  ApiServiceMock,
  IEpicParams,
  setupEpicRunner,
  TEpicRunner,
  TMarbleValues,
} from '../../../../../../../testHelpers/epicRunner';
import { INTEGRATION_STATUS_ACTIVE } from '../../../../../constants/organizationSettings.constants';
import { TIntegrationStatus } from '../../../../../components/OrganisationSettingsModule/Integrations/InHouseIntegrations/models/IntegrationsModels';

describe('hubspotEpics', () => {
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

  describe('organisationHubspotIntegrationCheckStatusEpic', () => {
    const runOrganisationHubspotIntegrationCheckStatusEpic = (
      epicParams: IEpicParams,
      expectedMarble: string,
      marbleValues: TMarbleValues,
    ) => {
      runEpic(organisationHubspotIntegrationCheckStatusEpic, epicParams, expectedMarble, marbleValues);
    };
    it('produces correct actions (success)', () => {
      const action = organisationHubspotIntegrationStatusCheckRequest();
      const response = { data: { status: INTEGRATION_STATUS_ACTIVE } };
      const dependencies = {
        apiGateway: {
          get: ApiService.get('a', { a: response }),
        },
      };
      // @ts-ignore
      runOrganisationHubspotIntegrationCheckStatusEpic({ action, dependencies }, '-b', {
        b: organisationHubspotIntegrationStatusCheckSuccess(response.data.status as TIntegrationStatus),
      });
    });
    // todo mock error-handling actions
    it.skip('produces correct actions (error)', () => {
      const action = organisationHubspotIntegrationStatusCheckRequest();
      const response = { errors: ['Error error'] };
      const dependencies = {
        apiGateway: {
          get: ApiService.get('-#', undefined, response),
        },
      };
      // @ts-ignore
      runOrganisationHubspotIntegrationCheckStatusEpic({ action, dependencies }, '--b', {
        b: organisationHubspotIntegrationStatusCheckFail(),
      });
    });
  });
});
