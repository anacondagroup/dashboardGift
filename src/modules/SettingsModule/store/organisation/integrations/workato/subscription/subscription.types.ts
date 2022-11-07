export type TIntegrationSubscription = {
  allowed: number;
  enabled: number;
};

export type TOrganizationSubscriptionsResponse = { integrations: TIntegrationSubscription };
