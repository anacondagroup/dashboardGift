import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Icon } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: palette.additional.chambray10,
    height: 80,
    padding: spacing(2, 3),
    zIndex: zIndex.appBar,
  },
  warningMessage: {
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle: 'italic',
    color: palette.error.main,
    marginRight: spacing(4),
  },
  saveBtn: { marginLeft: 'auto' },
}));

interface IActivateTabsFooterProps {
  isLoading: boolean;
  disabled: boolean;
  displayWarningMessage: boolean;
  displaySaveButton?: boolean;
  onSaveButtonClick: () => void;
}

const ActivateTabsFooter = ({
  isLoading,
  disabled,
  displayWarningMessage,
  displaySaveButton = true,
  onSaveButtonClick,
}: IActivateTabsFooterProps): JSX.Element => {
  const classes = useStyles();

  const SaveButtonIcon = isLoading ? <CircularProgress size={20} /> : <Icon icon="save" />;

  return (
    <Box height={80} mt={3}>
      <Box className={classes.root}>
        <Box display="flex" alignItems="center" mr={1}>
          {displayWarningMessage && (
            <Typography className={classes.warningMessage}>You have unsaved changes</Typography>
          )}
          {displaySaveButton && (
            <Button
              variant="contained"
              color="primary"
              disabled={disabled}
              onClick={onSaveButtonClick}
              data-testid="Settings.AppBar.GoBackBtn"
              endIcon={SaveButtonIcon}
            >
              Save
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ActivateTabsFooter;
