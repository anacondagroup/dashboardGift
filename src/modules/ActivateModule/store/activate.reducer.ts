import { combineReducers } from 'redux';
import { persistReducer, PersistedState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { entities, IActivateEntitiesState } from './entities';
import steps, { IActivateStepsState } from './steps';
import { ui, IActivateUIState } from './ui';
import { TIntegrationRemindersState, integrationReminders } from './integrationReminders';
import { IBrandingState, branding } from './branding';
import { productsCount, TProductsCountState } from './productsCount';

type TActivateDefaultModuleState = {
  entities: IActivateEntitiesState;
  steps: IActivateStepsState;
  ui: IActivateUIState;
  integrationReminders: TIntegrationRemindersState;
  branding: IBrandingState;
  productsCount: TProductsCountState;
};

export type TActivateModuleState = TActivateDefaultModuleState & PersistedState;

const activatePersistConfig = {
  key: 'activate',
  storage,
  whitelist: ['integrationReminders'],
};

const activateReducer = combineReducers<TActivateDefaultModuleState>({
  entities,
  steps,
  ui,
  integrationReminders,
  branding,
  productsCount,
});

export const activate = persistReducer(activatePersistConfig, activateReducer);
