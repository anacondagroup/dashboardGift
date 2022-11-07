import { createDataTree, INode, setNodeIsLoading } from './marketo.helpers';
import { MarketoFolderTypes, MarketoNodeTypes } from './marketo.types';

describe('Marketo', () => {
  describe('setNodeIsLoading tests', () => {
    it('sets isLoading property to true to clicked on node', () => {
      const nodeId = 3;
      const mockNodeLikeItems: INode[] = [
        {
          id: nodeId,
          nodeType: MarketoNodeTypes.Folder,
          parent: null,
        },
      ];
      const result = setNodeIsLoading(mockNodeLikeItems, nodeId);
      expect(result[0].isLoading).toBe(true);
    });

    it('leaves isLoading property as false in case node ID mismatch', () => {
      const nodeId = 3;
      const mockNodeLikeItems: INode[] = [
        {
          id: nodeId,
          nodeType: MarketoNodeTypes.Folder,
          parent: null,
        },
      ];
      const mockClickedOnNode = 4;

      const result = setNodeIsLoading(mockNodeLikeItems, mockClickedOnNode);

      expect(result[0].isLoading).toBe(false);
    });
  });

  describe('createDataTree tests', () => {
    it('returns valid data if the input is empty list', () => {
      const mockNodeLikeItems: INode[] = [];
      const result = createDataTree(mockNodeLikeItems);
      expect(result.length).toBe(0);
    });

    it('returns valid data if node has parent id which is not listed in node items', () => {
      const mockNodeLikeItems: INode[] = [
        {
          id: 3,
          nodeType: MarketoNodeTypes.Folder,
          parent: null,
        },
        {
          id: 200,
          nodeType: MarketoNodeTypes.Folder,
          parent: { id: 4, type: MarketoFolderTypes.Folder },
        },
        {
          id: 38,
          nodeType: MarketoNodeTypes.Folder,
          parent: { id: 3, type: MarketoFolderTypes.Folder },
        },
      ];

      const result = createDataTree(mockNodeLikeItems);

      expect(result[0].children.length).toBe(1);
      expect(result.length).toBe(1);
    });

    it('returns valid data tree if the only node-like param has no parent', () => {
      const mockNodeLikeItems: INode[] = [
        {
          id: 3,
          nodeType: MarketoNodeTypes.Folder,
          parent: null,
        },
      ];

      const result = createDataTree(mockNodeLikeItems);

      const expectedResult = {
        parent: null,
        id: mockNodeLikeItems[0].id,
        isLoading: false,
        nodeType: mockNodeLikeItems[0].nodeType,
        children: [],
      };

      expect(result[0]).toMatchObject(expectedResult);
    });

    it('returns vaild data tree', () => {
      const mockNodeLikeItems: INode[] = [
        {
          id: 3,
          nodeType: MarketoNodeTypes.Folder,
          parent: null,
        },
        {
          id: 200,
          nodeType: MarketoNodeTypes.Folder,
          parent: { id: 3, type: MarketoFolderTypes.Folder },
        },
        {
          id: 38,
          nodeType: MarketoNodeTypes.Folder,
          parent: { id: 3, type: MarketoFolderTypes.Folder },
        },
      ];

      const result = createDataTree(mockNodeLikeItems);

      const expectedResult = {
        id: mockNodeLikeItems[0].id,
        children: [
          {
            parent: {
              id: result[0].id,
            },
          },
          {
            parent: {
              id: result[0].id,
            },
          },
        ],
      };

      expect(result[0]).toMatchObject(expectedResult);
    });
  });
});
