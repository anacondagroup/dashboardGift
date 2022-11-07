import { UploadRequestSourceTypes } from '../uploadRequest/uploadRequest.types';

export interface IRequestMarketoFoldersPayload {
  uuid: string;
  listType: UploadRequestSourceTypes;
  node?: MarketoNode;
}

export interface ISuccessRequestMarketoFoldersPayload {
  folders: MarketoNode[];
  staticLists?: IMarketoStaticList[];
  parentId?: number;
}

export interface IMarketoIntegrationData {
  uuid: string;
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  status: IMarketoIntegrationStatuses;
  statusDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum IMarketoIntegrationStatuses {
  Active = 'active',
  Inactive = 'inactive',
}

export interface IMarketoFolder {
  id: number;
  type: MarketoFolderTypes;
  parent: IMarketoParentNode | null;
  nodeId: string; // nodeType + id = folder_200
  nodeType: MarketoNodeTypes;
  name: string;
  description: string;
  workspace: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMarketoStaticList extends IMarketoFolder {
  computedUrl: string;
}

export interface IMarketoSmartList extends Omit<IMarketoFolder, 'type'> {
  type: MarketoSmartListTypes;
  smartListId: number;
  computedUrl: string;
}

export type MarketoNode = IMarketoFolder | IMarketoStaticList | IMarketoSmartList;

export enum MarketoFolderTypes {
  Folder = 'Folder',
  Program = 'Program',
}

export enum MarketoNodeTypes {
  Folder = 'folder',
  StaticList = 'staticList',
  SmartCampaign = 'smartCampaign',
}

export enum MarketoSmartListTypes {
  Batch = 'batch',
  Trigger = 'trigger',
}

export interface IMarketoParentNode {
  id: number;
  type: MarketoFolderTypes | MarketoSmartListTypes;
}

export const isMarketoStaticList = (node: MarketoNode): node is IMarketoStaticList =>
  (node as IMarketoStaticList).computedUrl !== undefined;

export const isMarketoSmartList = (node: MarketoNode): node is IMarketoSmartList =>
  (node as IMarketoSmartList).smartListId !== undefined;
