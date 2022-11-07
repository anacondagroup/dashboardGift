import { TestScheduler } from 'rxjs/testing';
import { MessageType, showGlobalMessage } from '@alycecom/services';
import {
  ApiServiceMock,
  IEpicParams,
  setupEpicRunner,
  TEpicRunner,
  TMarbleValues,
} from '../../../../../../../testHelpers/epicRunner';
import {
  executeWorkatoRecipeActionEpic,
  runWorkatoRecipeActionEpic,
  updateWorkatoRecipeFieldsEpic,
} from './recipes.epics';
import { executeWorkatoRecipeAction, runWorkatoRecipeAction, updateWorkatoRecipeFields } from './recipes.actions';
import { IWorkatoRecipe, TRecipeAction } from '../workato.types';
import {
  IWorkatoRecipeExecutionAction,
  IWorkatoRecipeRunAction,
  IWorkatoRecipeRunActionResponse,
} from './recipes.types';
import { fetchOrganizationSubscriptions } from '../subscription/subscription.actions';

describe('recipes.epics.ts', () => {
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

  describe('executeWorkatoRecipeActionEpic', () => {
    const runExecuteWorkatoRecipeActionEpic = (
      epicParams: IEpicParams,
      expectedMarble: string,
      marbleValues: TMarbleValues,
    ) => {
      runEpic(executeWorkatoRecipeActionEpic, epicParams, expectedMarble, marbleValues);
    };

    it('emits correct action if there are fields', () => {
      const payload: IWorkatoRecipeExecutionAction = {
        recipeId: 'niceRecipeId',
        action: 'start' as TRecipeAction,
        fields: [
          { code: 'someCoolCode', value: 'Hi' },
          { code: 'evenCoolerCode', value: 'Hello' },
        ],
      };
      const action = executeWorkatoRecipeAction(payload);
      runExecuteWorkatoRecipeActionEpic({ action }, '-c', {
        c: updateWorkatoRecipeFields(payload),
      });
    });

    it('emits correct action if there are no fields', () => {
      const payload = {
        recipeId: 'niceRecipeId',
        action: 'stop' as TRecipeAction,
      };
      const action = executeWorkatoRecipeAction(payload);
      runExecuteWorkatoRecipeActionEpic({ action }, '-c', {
        c: runWorkatoRecipeAction(payload),
      });
    });
  });

  describe('updateWorkatoRecipeFieldsEpic', () => {
    const runUpdateWorkatoRecipeFieldsEpic = (
      epicParams: IEpicParams,
      expectedMarble: string,
      marbleValues: TMarbleValues,
    ) => {
      runEpic(updateWorkatoRecipeFieldsEpic, epicParams, expectedMarble, marbleValues);
    };

    it('successfully updates recipe fields', () => {
      const payload: IWorkatoRecipeExecutionAction = {
        recipeId: 'niceRecipeId',
        action: 'start' as TRecipeAction,
        fields: [
          { code: 'someCoolCode', value: 'Hi' },
          { code: 'evenCoolerCode', value: 'Hello' },
        ],
      };
      const action = updateWorkatoRecipeFields.pending(payload);

      const updateResponse: IWorkatoRecipe = {
        id: payload.recipeId,
        workatoRecipeId: '777',
        name: 'Cool recipe name',
        description: 'Cool recipe desc',
        running: true,
        lastRunAt: null,
        error: '',
        fields: [
          { code: 'someCoolCode', value: 'Hi' },
          { code: 'evenCoolerCode', value: 'Hello' },
        ],
      };

      const dependencies = {
        apiGateway: {
          put: ApiService.put('-b', { b: { data: updateResponse } }),
        },
      };
      // @ts-ignore
      runUpdateWorkatoRecipeFieldsEpic({ action, dependencies }, '--(cd)', {
        c: updateWorkatoRecipeFields.fulfilled(updateResponse),
        d: runWorkatoRecipeAction({ recipeId: payload.recipeId, action: payload.action }),
      });
    });
  });
  describe('runWorkatoRecipeActionEpic', () => {
    const runRunWorkatoRecipeActionEpic = (
      epicParams: IEpicParams,
      expectedMarble: string,
      marbleValues: TMarbleValues,
    ) => {
      runEpic(runWorkatoRecipeActionEpic, epicParams, expectedMarble, marbleValues);
    };

    it('runs required action', () => {
      const payload: IWorkatoRecipeRunAction = {
        recipeId: 'niceRecipeId',
        action: 'start' as TRecipeAction,
      };
      const action = runWorkatoRecipeAction(payload);

      const runActionResponse: IWorkatoRecipeRunActionResponse = {
        success: true,
        error: '',
      };
      const dependencies = {
        apiGateway: {
          post: ApiService.post('-a', { a: { data: runActionResponse } }),
        },
      };

      // @ts-ignore
      runRunWorkatoRecipeActionEpic({ action, dependencies }, '--(bcd)', {
        b: runWorkatoRecipeAction.fulfilled({
          action: payload.action,
          success: runActionResponse.success,
          recipeId: payload.recipeId,
        }),
        c: showGlobalMessage({ type: MessageType.Success, text: 'Recipe started successfully' }),
        d: fetchOrganizationSubscriptions(),
      });
    });
  });
});
