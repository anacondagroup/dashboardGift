import { TestScheduler } from 'rxjs/testing';
import { MessageType, GlobalMessage } from '@alycecom/services';

import {
  loadAssistSettingsEpic,
  updateAssistSettingsEpic,
  loadActiveIntegrationsEpic,
} from '../emailNotifications.epics';
import { initialState } from '../emailNotifications.reducer';
import {
  ApiServiceMock,
  setupEpicRunner,
  TEpicRunner,
  IEpicParams,
  TMarbleValues,
} from '../../../../../../testHelpers/epicRunner';
import {
  loadActiveIntegrationsRequest,
  loadActiveIntegrationsSuccess,
  loadEmailNotificationsSettingsRequest,
  loadEmailNotificationsSettingsSuccess,
  updateEmailNotificationsSettingsRequest,
  updateEmailNotificationsSettingsSuccess,
} from '../emailNotifications.actions';
import { IActiveIntegrationsResponse, TEmailNotificationsSettingsResponse } from '../emailNotifications.types';

export type TEpicRunnerWrapFun = (
  epicOptions: IEpicParams,
  expectedMarble: string,
  marbleValues: TMarbleValues,
) => void;

// TODO Type annotations will be fixed in scope of https://alycecom.atlassian.net/browse/PD-5469
describe('emailNotificationsEpics', () => {
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

  describe('loadActiveIntegrationsEpic', () => {
    const runLoadActiveIntegrationsEpic: TEpicRunnerWrapFun = (epicParams, expectedMarble, marbleValues) => {
      runEpic(loadActiveIntegrationsEpic, epicParams, expectedMarble, marbleValues);
    };

    it('Should load active integrations', () => {
      const action = loadActiveIntegrationsRequest();
      const response: IActiveIntegrationsResponse = {
        success: true,
        service: {
          email: 'email',
          name: 'name',
        },
        using_dkim: false,
      };
      const dependencies = {
        apiService: {
          get: ApiService.get('--r', { r: response }),
        },
      };

      // @ts-ignore
      runLoadActiveIntegrationsEpic({ action, dependencies }, '---a', {
        a: loadActiveIntegrationsSuccess({ active: true }),
      });
    });
  });

  describe('loadAssistSettingsEpic', () => {
    const runLoadAssistSettingsEpic: TEpicRunnerWrapFun = (epicParams, expectedMarble, marbleValues) => {
      runEpic(loadAssistSettingsEpic, epicParams, expectedMarble, marbleValues);
    };

    it('Should load assist settings', () => {
      const action = loadEmailNotificationsSettingsRequest();
      const response: TEmailNotificationsSettingsResponse = { assist: true };
      const dependencies = {
        apiService: {
          get: ApiService.get('--r', { r: response }),
        },
      };

      // @ts-ignore
      runLoadAssistSettingsEpic({ action, dependencies }, '---a', {
        a: loadEmailNotificationsSettingsSuccess({ assist: true }),
      });
    });
  });

  describe('updateAssistSettingsEpic', () => {
    const runUpdateAssistSettingsEpic: TEpicRunnerWrapFun = (epicParams, expectedMarble, marbleValues) => {
      runEpic(updateAssistSettingsEpic, epicParams, expectedMarble, marbleValues);
    };

    it('Should update assist settings', () => {
      const action = updateEmailNotificationsSettingsRequest();
      const state = {
        settings: {
          personal: {
            emailNotifications: initialState,
          },
        },
      };
      const response: TEmailNotificationsSettingsResponse = { assist: true };
      const dependencies = {
        apiService: {
          patch: ApiService.patch('--r', { r: response }),
        },
      };

      // @ts-ignore
      runUpdateAssistSettingsEpic({ action, state, dependencies }, '---(ab)', {
        a: updateEmailNotificationsSettingsSuccess(),
        b: GlobalMessage.messagesService.showGlobalMessage({
          type: MessageType.Success,
          text: 'Alyce Assist email settings have been updated',
        }),
      });
    });
  });
});
