import { generatePath, matchPath } from 'react-router-dom';

export enum SwagCampaignMode {
  Builder = 'builder',
}

export enum SwagCampaignBuilderStep {
  Details = 'details',
  Gift = 'gift',
  Messaging = 'messaging',
  Codes = 'codes',
  Finalize = 'finalize',
}

const modes = `${SwagCampaignMode.Builder}`;
const steps = Object.values(SwagCampaignBuilderStep).join('|');

export type TSwagRouteParams = {
  mode?: SwagCampaignMode;
  campaignId?: string;
  step?: SwagCampaignBuilderStep;
};

export const SwagCampaignRoutes = {
  basePath: `/swag/:mode(${modes})/:campaignId?/:step(${steps})?`,
  builderPath: `/swag/:mode(${SwagCampaignMode.Builder})/:campaignId(\\d+)?/:step(${steps})?`,

  buildBuilderUrl(campaignId?: number, step?: SwagCampaignBuilderStep): string {
    return generatePath(this.builderPath, {
      campaignId,
      step,
      mode: SwagCampaignMode.Builder,
    });
  },
  matchBuilderPath(
    path: string,
  ): null | {
    campaignId?: string;
    mode: SwagCampaignMode;
    step?: SwagCampaignBuilderStep;
  } {
    return (
      matchPath<{
        campaignId?: string;
        mode: SwagCampaignMode;
        step?: SwagCampaignBuilderStep;
      }>(path, {
        path: this.basePath,
      })?.params || null
    );
  },
  matchBasePath(path: string): null | TSwagRouteParams {
    return (
      matchPath<{
        campaignId?: string;
        mode: SwagCampaignMode;
        step?: SwagCampaignBuilderStep;
      }>(path, {
        path: this.basePath,
      })?.params || null
    );
  },
};
