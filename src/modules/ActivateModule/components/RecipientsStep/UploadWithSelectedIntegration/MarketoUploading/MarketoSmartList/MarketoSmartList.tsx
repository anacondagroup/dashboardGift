import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { AlyceLoading, FlatButton, Icon } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { difference } from 'ramda';
import { makeStyles } from '@mui/styles';

import {
  findNodeById,
  getIsMarketoListLoading,
  getMarketoElementsIcon,
  getMarketoRootNodeS,
  loadMarketoFoldersRequest,
  Tree as TreeType,
  uploadMarketoSmartListRequest,
} from '../../../../../store/steps/recipients/marketo';
import {
  isMarketoSmartList,
  MarketoNode,
  MarketoNodeTypes,
  MarketoSmartListTypes,
} from '../../../../../store/steps/recipients/marketo/marketo.types';
import TreeItem from '../../../../../../../components/Shared/Tree/TreeItem';
import HoverPopover from '../../../../../../../components/Shared/Popover/HoverPopover';
import Tree from '../../../../../../../components/Shared/Tree/Tree';
import { UploadRequestSourceTypes } from '../../../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import UploadingSectionContent from '../../../UploadingSectionContent';
import { useActivate } from '../../../../../hooks/useActivate';

const useStyles = makeStyles(() => ({
  button: {
    width: 210,
    boxShadow: 'none',
  },
}));

const renderMarketoFolders = (
  tree: TreeType<MarketoNode>[] | TreeType<MarketoNode> = [],
  smartCampaignId: string,
): React.ReactNode => {
  if (!tree) {
    return null;
  }
  if (Array.isArray(tree)) {
    return tree.map(node => renderMarketoFolders(node, smartCampaignId));
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
          ? renderMarketoFolders(tree.children, smartCampaignId)
          : [<Box key="invisible_item" display="none" />]}
      </TreeItem>
    );
  }
  if (isMarketoSmartList(tree) && tree.type !== MarketoSmartListTypes.Trigger) {
    return (
      <HoverPopover
        key={tree.id}
        width="320px"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        hint="Oops! This smart campaign is missing a trigger in the Smart List tab."
      >
        <TreeItem
          nodeId={`${tree.id}`}
          labelText={tree.name}
          labelIcon={tree.id === parseInt(smartCampaignId, 10) ? 'check' : getMarketoElementsIcon(tree.nodeType)}
          disabled
          isLeaf
        />
      </HoverPopover>
    );
  }
  return (
    <TreeItem
      key={tree.id}
      nodeId={`${tree.id}`}
      labelText={tree.name}
      labelIcon={tree.id === parseInt(smartCampaignId, 10) ? 'check' : getMarketoElementsIcon(tree.nodeType)}
      isLeaf
    />
  );
};

interface MarketoSmartListProps {
  uuid: string;
  isLoading: boolean;
  isMovingBackwardAllowed: boolean;
  handleBack: () => void;
}

const MarketoSmartList = ({
  uuid,
  isLoading,
  isMovingBackwardAllowed,
  handleBack,
}: MarketoSmartListProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { campaignId } = useActivate();
  const isListLoading = useSelector(getIsMarketoListLoading);
  const foldersTree = useSelector(getMarketoRootNodeS);

  const listType = UploadRequestSourceTypes.MarketoDynamic;
  const [smartCampaignId, setId] = useState('');
  const [selectedNode, setSelectedNode] = useState<MarketoNode | null>(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([]);

  const handleNodeSelect = useCallback(
    (_, id) => {
      const node = findNodeById(foldersTree, parseInt(id, 10));
      if (node && node.nodeType === MarketoNodeTypes.SmartCampaign) {
        setId(id);
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
    [dispatch, expandedNodeIds, foldersTree, listType, uuid],
  );

  const handleNext = useCallback(() => {
    if (campaignId && selectedNode && isMarketoSmartList(selectedNode)) {
      dispatch(
        uploadMarketoSmartListRequest({
          campaignId,
          smartCampaignId: parseInt(smartCampaignId, 10),
          computedUrl: selectedNode.computedUrl,
        }),
      );
    }
  }, [campaignId, dispatch, selectedNode, smartCampaignId]);

  useEffect(() => {
    if (uuid) {
      dispatch(loadMarketoFoldersRequest({ uuid, listType }));
    }
  }, [dispatch, uuid, listType]);

  return (
    <UploadingSectionContent
      title="Select which smart campaign you'd like to connect"
      description="Smart campaigns are used to dynamically send an Alyce Activate gift link. Use the folders below to search for
          your trigger smart campaign in Marketo."
    >
      <Box className="Label-Table-Left-Static">MARKETO FOLDERS</Box>
      <Box pb={1}>
        <Divider />
      </Box>
      <Tree
        selected={smartCampaignId}
        expanded={expandedNodeIds}
        onNodeToggle={handleNodeToggle}
        onNodeSelect={handleNodeSelect}
      >
        <AlyceLoading isLoading={isLoading || !foldersTree}>
          {renderMarketoFolders(foldersTree, smartCampaignId)}
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
            isListLoading ? <Icon spin color="inherit" icon="spinner" /> : <Icon color="inherit" icon="file-upload" />
          }
          variant="contained"
          color="secondary"
          onClick={handleNext}
          disabled={!smartCampaignId}
          fullWidth
        >
          Link your campaign
        </Button>
      </Box>
    </UploadingSectionContent>
  );
};

export default MarketoSmartList;
