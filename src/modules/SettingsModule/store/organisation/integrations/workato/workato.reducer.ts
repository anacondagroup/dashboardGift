import { combineReducers } from 'redux';

import { IOauthState, oauth } from './oauth/oauth.reducer';
import { IIntegrationState, integrations } from './integrations/integrations.reducer';
import { connections, IConnectionState } from './connections/connections.reducer';
import { TRecipesState, recipes } from './recipes/recipes.reducer';
import { IPicklistsState, picklists } from './picklists/picklists.reducer';
import { TSubscriptionState, subscription } from './subscription/subscription.reducer';
import {
  TActiveOneToManyCampaignsState,
  activeOneToManyCampaigns,
} from './activeOneToManyCampaigns/activeOneToManyCampaigns.reducer';
import { embedding, IEmbeddingState } from './embedding/embedding.reducer';

export interface IWorkatoState {
  oauth: IOauthState;
  embedding: IEmbeddingState;
  integrations: IIntegrationState;
  connections: IConnectionState;
  recipes: TRecipesState;
  picklists: IPicklistsState;
  subscription: TSubscriptionState;
  activeOneToManyCampaigns: TActiveOneToManyCampaignsState;
}
export const workato = combineReducers<IWorkatoState>({
  oauth,
  embedding,
  integrations,
  connections,
  recipes,
  picklists,
  subscription,
  activeOneToManyCampaigns,
});
