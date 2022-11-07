import { generatePath, matchPath } from 'react-router-dom';

export enum ActivateModes {
  Builder = 'builder',
  Editor = 'editor',
}

export enum ActivateBuilderStep {
  Details = 'details',
  Gift = 'gift',
  Messaging = 'messaging',
  Recipients = 'recipients',
  Finalize = 'finalize',
}

export enum ActivateEditorStep {
  Settings = 'settings',
  Recipients = 'recipients',
  GiftLinks = 'gift-links',
}

export enum ActivateEditorTab {
  Details = 'details',
  Gift = 'gift',
  Messaging = 'messaging',
}

const modes = `${ActivateModes.Builder}|${ActivateModes.Editor}`;
const steps = Object.values(ActivateBuilderStep).join('|');
const editorSteps = Object.values(ActivateEditorStep).join('|');
const tabs = Object.values(ActivateEditorTab).join('|');

export type TActivateRouteParams = {
  mode?: ActivateModes;
  campaignId?: string;
  tab?: ActivateEditorTab;
  step?: ActivateBuilderStep | ActivateEditorStep;
};

export const ActivateCampaignRoutes = {
  basePath: `/activate/:mode(${modes})/:campaignId?/:step(${steps}|${editorSteps})?/:tab(${tabs})?`,
  builderPath: `/activate/:mode(${ActivateModes.Builder})/:campaignId(\\d+)?/:step(${steps})?`,
  editorPath: `/activate/:mode(${ActivateModes.Editor})/:campaignId(\\d+)/:step(${editorSteps})?/:tab(${tabs})?`,

  buildBuilderUrl(campaignId?: number, step?: ActivateBuilderStep): string {
    return generatePath(this.builderPath, {
      campaignId,
      step,
      mode: ActivateModes.Builder,
    });
  },

  buildEditorUrl(campaignId: number, step?: ActivateEditorStep, tab?: ActivateEditorTab): string {
    return generatePath(this.editorPath, {
      campaignId,
      mode: ActivateModes.Editor,
      step,
      tab,
    });
  },

  matchBuilderPath(
    path: string,
  ): null | {
    campaignId?: string;
    mode: ActivateModes;
    step?: ActivateBuilderStep;
  } {
    return (
      matchPath<{
        campaignId: string;
        mode: ActivateModes;
        step?: ActivateBuilderStep;
      }>(path, {
        path: this.basePath,
      })?.params || null
    );
  },

  matchBasePath(path: string): null | TActivateRouteParams {
    return (
      matchPath<{
        campaignId: string;
        mode: ActivateModes;
        step?: ActivateBuilderStep | ActivateEditorStep;
        tab?: ActivateEditorTab;
      }>(path, {
        path: this.basePath,
      })?.params || null
    );
  },
} as const;
