import { TestScheduler } from 'rxjs/testing';
import { ActionsObservable, Epic, StateObservable } from 'redux-observable';
import { GlobalMessage } from '@alycecom/services';
import { Action } from 'redux';

import { IRootState } from '../store/root.types';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type TAnyMock = jest.Mock<any, any>;

export class ApiServiceMock {
  public readonly testScheduler: TestScheduler;

  constructor(_testScheduler: TestScheduler) {
    this.testScheduler = _testScheduler;
  }

  private fakeRequest<T = string>(marbles: string, values?: { [marble: string]: T }, error?: unknown) {
    if (error) {
      return jest.fn().mockImplementationOnce(() => this.testScheduler.createColdObservable(marbles, undefined, error));
    }
    return jest.fn().mockImplementationOnce(() => this.testScheduler.createColdObservable(marbles, values));
  }

  get<T = string>(marbles: string, values?: { [marble: string]: T }, error?: unknown): TAnyMock {
    return this.fakeRequest(marbles, values, error);
  }

  post<T = string>(marbles: string, values?: { [marble: string]: T }, error?: unknown): TAnyMock {
    return this.fakeRequest(marbles, values, error);
  }

  patch<T = string>(marbles: string, values?: { [marble: string]: T }, error?: unknown): TAnyMock {
    return this.fakeRequest(marbles, values, error);
  }

  put<T = string>(marbles: string, values?: { [marble: string]: T }, error?: unknown): TAnyMock {
    return this.fakeRequest(marbles, values, error);
  }
}

interface ActionMarblesMap {
  marbles: string;
  marbleValues: Record<string, Action>;
}

const isActionMarblesMap = (marblesMap: Action | ActionMarblesMap): marblesMap is ActionMarblesMap =>
  (marblesMap as ActionMarblesMap).marbles !== undefined && (marblesMap as ActionMarblesMap).marbleValues !== undefined;

export type TEpicAction = Action | ActionMarblesMap;
export interface IEpicParams {
  action: TEpicAction;
  state?: Partial<IRootState>;
  dependencies?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messagesService?: any;
    apiService: ApiServiceMock;
  };
}
export type TMarbleValues = { [marble: string]: unknown };
export type TEpicRunner = (
  epic: Epic,
  epicParams: IEpicParams,
  expectedMarble: string,
  marbleValues: TMarbleValues,
) => void;
export type TSetupEpicRunner = (testScheduler: TestScheduler) => { ApiService: ApiServiceMock; runEpic: TEpicRunner };

export const setupEpicRunner: TSetupEpicRunner = testScheduler => {
  const ApiService = new ApiServiceMock(testScheduler);
  const runEpic: TEpicRunner = (epic, epicParams, expectedMarble, marbleValues) => {
    const { action, state, dependencies } = epicParams;
    const deps = {
      // @ts-ignore
      messagesService: GlobalMessage.messagesService,
      ...dependencies,
    };
    const actionMarbles = isActionMarblesMap(action) ? action.marbles : '-a';
    const actionMarbleValues = isActionMarblesMap(action) ? action.marbleValues : { a: action };

    testScheduler.run(({ hot, expectObservable }) => {
      const action$ = new ActionsObservable(hot(actionMarbles, actionMarbleValues));
      const state$ = new StateObservable(
        hot('s', {
          s: state,
        }),
        state,
      );

      expectObservable(epic(action$, state$, deps)).toBe(expectedMarble, marbleValues);
    });
  };

  return {
    ApiService,
    runEpic,
  };
};
