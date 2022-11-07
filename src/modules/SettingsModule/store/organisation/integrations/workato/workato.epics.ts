import { connectionsEpics } from './connections/connections.epics';
import { oauthEpics } from './oauth/oauth.epics';
import { recipesEpics } from './recipes/recipes.epics';
import { integrationEpics } from './integrations/integrations.epics';
import { picklistsEpics } from './picklists/picklists.epics';
import { subscriptionEpics } from './subscription/subscription.epics';
import { activeOneToManyCampaignsEpics } from './activeOneToManyCampaigns/activeOneToManyCampaigns.epics';
import { embeddingEpics } from './embedding/embedding.epics';

export const workatoEpics = [
  ...oauthEpics,
  ...embeddingEpics,
  ...integrationEpics,
  ...connectionsEpics,
  ...recipesEpics,
  ...picklistsEpics,
  ...subscriptionEpics,
  ...activeOneToManyCampaignsEpics,
];
