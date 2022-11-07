import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import TreeItem from '@mui/lab/TreeItem';
import { AlyceTheme, Icon, TIconName } from '@alycecom/ui';
import { TreeItemProps } from '@mui/lab/TreeItem/TreeItem';

const useStyles = makeStyles<AlyceTheme, { disabled: boolean }>(theme => ({
  root: {
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label, &$selected:focus > $content $label': {
      backgroundColor: 'transparent',
    },
    '&$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    height: 35,
    color: theme.palette.link.main,
  },
  disabled: {
    pointerEvents: 'none',
    color: `${theme.palette.text.disabled} !important`,
  },
  group: {
    color: theme.palette.link.main,
  },
  label: {
    paddingLeft: theme.spacing(2.25),
  },
  selected: {
    backgroundColor: theme.palette.additional.blue10,
    pointerEvents: 'none',
  },
  labelRoot: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  leafLabelText: {
    fontWeight: 'bold',
    color: ({ disabled }) => (disabled ? theme.palette.text.disabled : theme.palette.link.main),
  },
  leafLabel: {
    marginRight: theme.spacing(1),
    width: '0.775rem !important',
    height: '0.725rem !important',
  },
}));

interface ITreeViewProps extends TreeItemProps {
  labelText: string;
  labelIcon?: TIconName;
  labelInfo?: string;
  isLoading?: boolean;
  isLeaf?: boolean;
  disabled?: boolean;
}

const TreeView = ({
  labelText,
  labelIcon,
  labelInfo = '',
  isLoading = false,
  isLeaf = false,
  disabled = false,
  ...treeProps
}: ITreeViewProps): JSX.Element => {
  const classes = useStyles({ disabled });
  return (
    <TreeItem
      collapseIcon={
        isLoading && <Icon icon="spinner" spin={isLoading} color="inherit" className={classes.labelIcon} size="sm" />
      }
      label={
        <div className={classes.labelRoot}>
          {labelIcon && <Icon icon={labelIcon} color="inherit" className={classes.leafLabel} size="sm" />}
          <Box flexGrow={1} className={isLeaf ? classes.leafLabelText : 'Body-Regular-Left-Static'}>
            {labelText}
          </Box>
          {labelInfo && (
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          )}
        </div>
      }
      classes={{
        root: classes.root,
        content: disabled ? classes.disabled : classes.content,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...treeProps}
    />
  );
};

export default TreeView;
