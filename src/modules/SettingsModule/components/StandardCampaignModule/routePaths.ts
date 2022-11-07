import { generatePath } from 'react-router-dom';

export enum StandardCampaignMode {
  Create = 'create',
  Editor = 'editor',
}

export enum StandardCampaignEditorTabs {
  SettingsAndPermissions = 'settings-and-permissions',
}

export enum StandardCampaignEditorSubTabs {
  General = 'general',
  DefaultMessage = 'default-message',
  CodeInventory = 'code-inventory',
  LandingPageMessage = 'landing-page-message',
  GiftInvites = 'gift-invites',
  SwagInvites = 'swag-invites',
}

const modes = `${StandardCampaignMode.Create}|${StandardCampaignMode.Editor}`;
const tabs = Object.values(StandardCampaignEditorTabs).join('|');
const subTabs = Object.values(StandardCampaignEditorSubTabs).join('|');

export const StandardCampaignRoutes = {
  basePath: `/campaign/:mode(${modes})/:campaignId?/:tab(${tabs})?/:subTab(${subTabs})?`,
  creatorPath: `/campaign/:mode(${StandardCampaignMode.Create})/`,
  editorPath: `/campaign/:mode(${StandardCampaignMode.Editor})/:campaignId(\\d+)/:tab(${tabs})?/:subTab(${subTabs})?`,

  buildEditorUrl(campaignId: number, tab?: StandardCampaignEditorTabs, subTab?: StandardCampaignEditorSubTabs): string {
    return generatePath(this.editorPath, {
      campaignId,
      mode: StandardCampaignMode.Editor,
      tab,
      subTab,
    });
  },

  buildCreateUrl(): string {
    return generatePath(this.creatorPath, {
      mode: StandardCampaignMode.Create,
    });
  },
};
