import { TestScheduler } from 'rxjs/testing';
import { setupEpicRunner } from '../../../../../../../testHelpers/epicRunner';
import { organisationMarketoIntegrationsEpic, organisationMarketoIntegrationEpic } from '../marketo.epics';
import {
  organisationMarketoIntegrationRequest,
  organisationMarketoIntegrationsFail,
  organisationMarketoIntegrationsRequest,
  organisationMarketoIntegrationsSuccess,
  organisationMarketoIntegrationSuccess,
} from '../marketo.actions';

describe('marketoEpics', () => {
  let testScheduler;
  let ApiService;
  let runEpic;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    const utils = setupEpicRunner(testScheduler);
    ApiService = utils.ApiService;
    runEpic = utils.runEpic;
  });
  describe('organisationMarketoIntegrationsEpic', () => {
    const runOrganisationMarketoIntegrationsEpic = (epicParams, expectedMarble, marbleValues) => {
      runEpic(organisationMarketoIntegrationsEpic, epicParams, expectedMarble, marbleValues);
    };

    it('produces correct actions (success)', () => {
      const action = organisationMarketoIntegrationsRequest();
      const dependencies = {
        messagesService: {
          errorHandlerWithGlobal: () => {},
        },
        marketoService: {
          get: ApiService.get('a', { a: 'something' }),
        },
      };
      runOrganisationMarketoIntegrationsEpic({ action, dependencies }, '300ms -b', {
        b: organisationMarketoIntegrationsSuccess('something'),
      });
    });
    it.skip('produces correct actions (error)', () => {
      const action = organisationMarketoIntegrationsRequest();
      const errorResponse = { errors: ['Error error'] };
      const dependencies = {
        messagesService: {
          errorHandlerWithGlobal: () => {},
        },
        marketoService: {
          get: ApiService.get('-#', undefined, errorResponse),
        },
      };
      runOrganisationMarketoIntegrationsEpic({ action, dependencies }, '300ms --b', {
        b: organisationMarketoIntegrationsFail(errorResponse.errors),
      });
    });
  });
  describe('organisationMarketoIntegrationsEpic', () => {
    const runOrganisationMarketoIntegrationEpic = (epicParams, expectedMarble, marbleValues) => {
      runEpic(organisationMarketoIntegrationEpic, epicParams, expectedMarble, marbleValues);
    };
    it('produces correct actions (success)', () => {
      const action = organisationMarketoIntegrationRequest('007');
      const response = 'some integration';
      const dependencies = {
        messagesService: {
          errorHandlerWithGlobal: () => {},
        },
        marketoService: {
          get: ApiService.get('a', { a: response }),
        },
      };
      runOrganisationMarketoIntegrationEpic({ action, dependencies }, '300ms -b', {
        b: organisationMarketoIntegrationSuccess(response),
      });
    });
    it.skip('produces correct actions (error)', () => {});
  });
});
