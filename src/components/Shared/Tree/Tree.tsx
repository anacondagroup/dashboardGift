import React from 'react';
import { makeStyles } from '@mui/styles';
import { TreeView as MuiTreeView, TreeViewProps as MuiTreeViewProps } from '@mui/lab';
import { Icon } from '@alycecom/ui';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  collapseIcon: {
    width: 12,
    height: 12,
  },
});

export type TreeViewProps = MuiTreeViewProps & {
  children?: React.ReactNode;
};

const TreeView = ({ children = null, ...treeProps }: TreeViewProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <MuiTreeView
      className={classes.root}
      defaultCollapseIcon={<Icon className={classes.collapseIcon} icon="chevron-down" color="link" />}
      defaultExpandIcon={<Icon className={classes.collapseIcon} icon="chevron-right" color="link" />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      {...treeProps}
    >
      {children}
    </MuiTreeView>
  );
};

export default TreeView;
