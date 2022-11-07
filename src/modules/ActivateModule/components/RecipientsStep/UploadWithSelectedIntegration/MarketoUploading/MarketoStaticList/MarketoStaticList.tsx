import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { difference } from 'ramda';
import { makeStyles } from '@mui/styles';
import { Box, Button, Divider } from '@mui/material';
import { AlyceLoading, AlyceTheme, Icon, FlatButton } from '@alycecom/ui';

import {
  getIsMarketoListLoading,
  getMarketoRootNodeS,
  getMarketoElementsIcon,
  uploadMarketoStaticListRequest,
  loadMarketoFoldersRequest,
  findNodeById,
  Tree as TreeType,
} from '../../../../../store/steps/recipients/marketo';
import {
  isMarketoStaticList,
  MarketoNode,
  MarketoNodeTypes,
} from '../../../../../store/steps/recipients/marketo/marketo.types';
import Tree from '../../../../../../../components/Shared/Tree/Tree';
import TreeItem from '../../../../../../../components/Shared/Tree/TreeItem';
import { UploadRequestSourceTypes } from '../../../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import UploadingSectionContent from '../../../UploadingSectionContent';
import { useActivate } from '../../../../../hooks/useActivate';

const useStyles = makeStyles<AlyceTheme>(() => ({
  button: {
    width: 200,
    boxShadow: 'none',
  },
}));

const renderMarketoFolders = (
  tree: TreeType<MarketoNode>[] | TreeType<MarketoNode> = [],
  staticListId: string,
): React.ReactNode => {
  if (!tree) {
    return null;
  }
  if (Array.isArray(tree)) {
    return tree.map(node => renderMarketoFolders(node, staticListId));
  }

  if (tree.nodeType === MarketoNodeTypes.Folder) {
    return (
      <TreeItem
        key={tree.id}
        nodeId={`${tree.nodeId}`}
        labelIcon={getMarketoElementsIcon(tree.type)}
        labelText={tree.name}
        isLoading={tree.isLoading}
      >
        {tree.children && tree.children.length
          ? renderMarketoFolders(tree.children, staticListId)
          : [<Box key="invisible_item" display="none" />]}
      </TreeItem>
    );
  }
  return (
    <TreeItem
      key={tree.id}
      nodeId={`${tree.id}`}
      labelText={tree.name}
      labelIcon={tree.id === parseInt(staticListId, 10) ? 'check' : getMarketoElementsIcon(tree.nodeType)}
      isLeaf
    />
  );
};

interface IMarketoStaticListProps {
  uuid: string;
  isLoading: boolean;
  isMovingBackwardAllowed: boolean;
  handleBack: () => void;
}

const MarketoStaticList = ({
  uuid,
  isLoading,
  isMovingBackwardAllowed,
  handleBack,
}: IMarketoStaticListProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { campaignId } = useActivate();
  const isListLoading = useSelector(getIsMarketoListLoading);
  const foldersTree = useSelector(getMarketoRootNodeS);

  const listType = UploadRequestSourceTypes.MarketoStatic;
  const [staticListId, setStaticListId] = useState('');
  const [selectedNode, setSelectedNode] = useState<MarketoNode | null>(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([]);

  const handleNodeSelect = useCallback(
    (_, id) => {
      const node = findNodeById(foldersTree, parseInt(id, 10));
      if (node && node.nodeType === MarketoNodeTypes.StaticList) {
        setStaticListId(id);
        setSelectedNode(node);
      }
    },
    [foldersTree],
  );

  const handleNodeToggle = useCallback(
    (_, ids: string[]) => {
      const toggledNodeId = difference(ids, expandedNodeIds)[0];
      setExpandedNodeIds(ids);
      if (!toggledNodeId) {
        return;
      }
      const node = findNodeById(foldersTree, parseInt(toggledNodeId.split('_')[1], 10));
      if (node?.children?.length) {
        return;
      }
      const payload = { uuid, node, listType };
      dispatch(loadMarketoFoldersRequest(payload));
    },
    [dispatch, expandedNodeIds, foldersTree, uuid, listType],
  );

  const handleNext = useCallback(() => {
    if (campaignId && selectedNode && isMarketoStaticList(selectedNode)) {
      dispatch(
        uploadMarketoStaticListRequest({
          campaignId,
          staticListId: parseInt(staticListId, 10),
          computedUrl: selectedNode.computedUrl,
        }),
      );
    }
  }, [campaignId, dispatch, selectedNode, staticListId]);

  useEffect(() => {
    if (uuid) {
      dispatch(loadMarketoFoldersRequest({ uuid, listType }));
    }
  }, [dispatch, uuid, listType]);

  return (
    <UploadingSectionContent
      title="Select which static list you'd like to connect"
      description="Static lists are a list of names from your Marketo Database. Use the folders below to search for your static
          lists in Marketo."
    >
      <Box className="Label-Table-Left-Static">MARKETO FOLDERS</Box>
      <Box pb={1}>
        <Divider />
      </Box>
      <Tree
        selected={[staticListId]}
        expanded={expandedNodeIds}
        onNodeSelect={handleNodeSelect}
        onNodeToggle={handleNodeToggle}
      >
        <AlyceLoading isLoading={isLoading || !foldersTree}>
          {renderMarketoFolders(foldersTree, staticListId)}
        </AlyceLoading>
      </Tree>
      <Box
        width="100%"
        mt={2}
        display="flex"
        justifyContent={isMovingBackwardAllowed ? 'space-between' : 'flex-end'}
        alignItems="center"
      >
        {isMovingBackwardAllowed && (
          <FlatButton icon="arrow-left" onClick={handleBack} disabled={isListLoading}>
            Back to list selection
          </FlatButton>
        )}
        <Button
          className={classes.button}
          startIcon={
            isListLoading ? (
              <Icon spin className={classes.buttonIcon} color="inherit" icon="spinner" />
            ) : (
              <Icon className={classes.buttonIcon} color="inherit" icon="file-upload" />
            )
          }
          variant="contained"
          color="secondary"
          onClick={handleNext}
          disabled={!staticListId}
          fullWidth
        >
          Import your list
        </Button>
      </Box>
    </UploadingSectionContent>
  );
};

export default MarketoStaticList;
