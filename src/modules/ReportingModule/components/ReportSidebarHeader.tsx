import React, { memo, useCallback } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, ModalConfirmationMessage } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useModalState } from '@alycecom/hooks';

import { setIsFormDirty, setSidebarStep } from '../store/reportingSidebar/reportingSidebar.actions';
import { getIsFormDirty, getPrevSidebarStep } from '../store/reportingSidebar/reportingSidebar.selectors';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  header: {
    height: 80,
    width: '100%',
    padding: spacing(2, 1, 2, 3),
    position: 'relative',
    '&::before': {
      position: 'absolute',
      content: "''",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: 'linear-gradient(to right, #017CBF 0%, #33447C 100%)',
    },
    color: palette.common.white,
  },
  closeButton: {
    color: palette.common.white,
    '& svg': {
      width: '26px !important',
      height: '26px !important',
    },
    marginLeft: spacing(2),
  },
  backButton: {
    color: palette.common.white,

    '& svg': {
      margin: spacing(0, 2),
    },
  },
}));

export interface IUsersSidebarHeaderProps {
  title?: string | null;
  goBack?: boolean;
  onCloseSidebar?: () => void;
  isEditReport?: boolean;
}

const ReportSidebarHeader = ({
  title = 'Create users',
  onCloseSidebar,
  goBack,
  isEditReport,
}: IUsersSidebarHeaderProps): JSX.Element => {
  const classes = useStyles();
  const { isOpen, handleClose, handleOpen } = useModalState();
  const dispatch = useDispatch();
  const handleCloseDiscardModal = useCallback(() => handleClose(), [handleClose]);

  const previousStep = useSelector(getPrevSidebarStep);
  const isFormDirty = useSelector(getIsFormDirty);

  const handleOpenDiscardModal = useCallback(() => {
    if (!isOpen && isFormDirty) {
      handleOpen();
    } else {
      dispatch(setIsFormDirty(false));
      dispatch(setSidebarStep({ step: previousStep }));
    }
  }, [dispatch, previousStep, handleOpen, isOpen, isFormDirty]);

  const handleGoBackToAutomatedReport = useCallback(() => {
    handleClose();
    dispatch(setIsFormDirty(false));
    dispatch(setSidebarStep({ step: previousStep }));
  }, [dispatch, handleClose, previousStep]);

  const dialogMessages = {
    title: isEditReport ? 'Discard changes' : 'Discard Report',
    message: isEditReport
      ? 'Are you sure you wish to discard any changes for this automated report?'
      : 'Are you sure you want to discard this report?',
  };
  return (
    <Box className={classes.header} display="flex">
      <Box display="flex" flexGrow={1} alignItems="center">
        {title && <Typography variant="h4">{title}</Typography>}
      </Box>
      {goBack ? (
        <Button
          className={classes.backButton}
          onClick={handleOpenDiscardModal}
          data-testid="UsersManagement.Sidebar.Back"
        >
          <Icon icon="arrow-left" />
          <Typography>Back</Typography>
        </Button>
      ) : (
        <IconButton
          className={classes.closeButton}
          onClick={onCloseSidebar}
          data-testid="UsersManagement.Sidebar.Close"
        >
          <Icon icon={['far', 'times']} />
        </IconButton>
      )}
      <ModalConfirmationMessage
        isOpen={isOpen}
        title={dialogMessages.title}
        width="100%"
        icon="pencil"
        submitButtonText="Yes"
        cancelButtonText="No"
        backdropStyles={{ top: 0 }}
        onSubmit={handleGoBackToAutomatedReport}
        onDiscard={handleCloseDiscardModal}
      >
        <Typography className="Body-Regular-Left-Static">{dialogMessages.message}</Typography>
      </ModalConfirmationMessage>
    </Box>
  );
};

export default memo(ReportSidebarHeader);
