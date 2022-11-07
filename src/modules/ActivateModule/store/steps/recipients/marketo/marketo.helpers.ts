import { IconProp } from '@alycecom/ui';

import { UploadRequestSourceTypes } from '../uploadRequest/uploadRequest.types';

import { IMarketoParentNode, MarketoNode, MarketoNodeTypes } from './marketo.types';

export const createQuery = (node?: IMarketoParentNode): string =>
  node ? `?parentId=${node.id}&parentType=${node.type}` : '?depth=2';

export interface INode {
  id: number;
  parent: IMarketoParentNode | null;
  nodeType: MarketoNodeTypes;
}

export type Tree<T> = T & {
  id: number;
  isLoading: boolean;
  children: Tree<T>[];
};

export const createDataTree = <T extends INode>(nodeLikeItems: T[], cb?: (node: T) => T): Tree<T>[] => {
  const hashTable: Record<string, Tree<T>> = {};
  const dataTree: Tree<T>[] = [];

  const treeNodeDefaultCreator = (node: T): T => ({
    ...node,
    isLoading: false,
  });

  nodeLikeItems.forEach(nodeLikeItem => {
    hashTable[nodeLikeItem.id] = {
      ...nodeLikeItem,
      isLoading: false,
      ...(cb ? cb(nodeLikeItem) : treeNodeDefaultCreator(nodeLikeItem)),
      children: [],
    };
  });

  nodeLikeItems.forEach(nodeLikeItem => {
    if (nodeLikeItem.parent?.id) {
      if (!hashTable[nodeLikeItem.parent.id]) return;
      hashTable[nodeLikeItem.parent.id].children.push(hashTable[nodeLikeItem.id]);
    } else {
      dataTree.push(hashTable[nodeLikeItem.id]);
    }
  });

  return dataTree;
};

export const leaveFirstFolder = (folders: MarketoNode[] = []): MarketoNode[] => {
  if (!folders.length) {
    return folders;
  }
  return [folders[0]];
};

export const setNodeIsLoading = <T extends INode>(items: T[], id: number): Tree<T>[] => {
  const tree = createDataTree(items, node => {
    if (node.id === id) {
      return {
        ...node,
        isLoading: true,
      };
    }
    return node;
  });

  return tree;
};

export const getMarketoElementsIcon = (type: string): IconProp | undefined => {
  switch (type) {
    case 'Folder':
      return 'folder-open';
    case 'Program':
      return 'book';
    case MarketoNodeTypes.SmartCampaign:
      return 'lightbulb-on';
    case MarketoNodeTypes.StaticList:
      return ['far', 'list-alt'];
    default:
      return undefined;
  }
};

export const findNodeById = <T>(trees: Tree<T>[] = [], id: string | number): Tree<T> | undefined =>
  trees.reduce(
    (foundNode: Tree<T> | undefined, node) =>
      foundNode || (node.id === Number(id) ? node : findNodeById(node.children, id)),
    undefined,
  );

export const getMarketoAssetNameBasedOnListType = (listType: UploadRequestSourceTypes): string =>
  listType === UploadRequestSourceTypes.MarketoStatic ? 'static-lists' : 'smart-campaigns';
