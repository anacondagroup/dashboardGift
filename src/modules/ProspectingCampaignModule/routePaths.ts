import { generatePath, matchPath } from 'react-router-dom';

export enum ProspectingMode {
  Builder = 'builder',
  Editor = 'editor',
}

export enum ProspectingBuilderStep {
  Details = 'details',
  Gift = 'gift',
  Messaging = 'messaging',
  Invites = 'invites',
  Finalize = 'finalize',
}

export enum ProspectingEditorTabs {
  Details = 'details',
  Gift = 'gift',
  Messaging = 'messaging',
}

export enum ProspectingEditorStep {
  Settings = 'settings',
  Invites = 'invites',
}

const modes = `${ProspectingMode.Builder}|${ProspectingMode.Editor}`;
const steps = Object.values(ProspectingBuilderStep).join('|');
const tabs = Object.values(ProspectingEditorTabs).join('|');
const editorSteps = Object.values(ProspectingEditorStep).join('|');

export type TProspectingRouteParams = {
  mode?: ProspectingMode;
  campaignId?: string;
  tab?: ProspectingEditorTabs;
  step?: ProspectingBuilderStep | ProspectingEditorStep;
};

export const ProspectingCampaignRoutes = {
  basePath: `/prospecting/:mode(${modes})/:campaignId?/:step(${steps}|${editorSteps})?/:tab(${tabs})?`,
  builderPath: `/prospecting/:mode(${ProspectingMode.Builder})/:campaignId(\\d+)?/:step(${steps})?`,
  editorPath: `/prospecting/:mode(${ProspectingMode.Editor})/:campaignId(\\d+)/:step(${editorSteps})?/:tab(${tabs})?`,

  buildBuilderUrl(campaignId?: number, step?: ProspectingBuilderStep): string {
    return generatePath(this.builderPath, {
      campaignId,
      step,
      mode: ProspectingMode.Builder,
    });
  },
  buildEditorUrl(campaignId: number, step?: ProspectingEditorStep, tab?: ProspectingEditorTabs): string {
    return generatePath(this.editorPath, {
      campaignId,
      mode: ProspectingMode.Editor,
      step,
      tab,
    });
  },
  matchBuilderPath(
    path: string,
  ): null | {
    campaignId?: string;
    mode: ProspectingMode;
    step?: ProspectingBuilderStep;
  } {
    return (
      matchPath<{
        campaignId?: string;
        mode: ProspectingMode;
        step?: ProspectingBuilderStep;
      }>(path, {
        path: this.basePath,
      })?.params || null
    );
  },
  matchBasePath(path: string): null | TProspectingRouteParams {
    return (
      matchPath<{
        campaignId?: string;
        mode: ProspectingMode;
        step?: ProspectingBuilderStep | ProspectingEditorStep;
        tab?: ProspectingEditorTabs;
      }>(path, {
        path: this.basePath,
      })?.params || null
    );
  },
};
