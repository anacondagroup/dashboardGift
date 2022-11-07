import React, { useCallback, memo } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, Button, ModalConfirmationMessage } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { StateStatus } from '@alycecom/utils';

import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import StepSection from '../StepSection/StepSection';
import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setUsersSidebarStep } from '../../store/usersOperation/usersOperation.actions';
import { getIsFileRejected } from '../../store/bulkCreate/bulkCreate.selectors';
import { setUploadFileStatus } from '../../store/bulkCreate/bulkCreate.actions';
import { useTrackFileValidationError } from '../../hooks/useTrackUsersManagement';

import BulkUploadUsersTemplate from './BulkUploadUsersTemplate';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  button: {
    width: 130,
    height: 48,
    marginRight: spacing(1),
  },
  link: {
    textDecoration: 'none',
    fontWeight: 'normal',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const ChooseFile = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isFileRejected = useSelector(getIsFileRejected);

  const handleGoBack = useCallback(() => dispatch(setUsersSidebarStep(UsersSidebarStep.userInfo)), [dispatch]);
  const handleCloseModal = useCallback(() => dispatch(setUploadFileStatus(StateStatus.Idle)), [dispatch]);

  useTrackFileValidationError();

  return (
    <StepSection step={UsersSidebarStep.chooseFile}>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="calc(100vh - 222px)">
        <BulkUploadUsersTemplate />
        <StepSectionFooter
          stepNumber={2}
          stepsCount={4}
          backButton={
            <Button
              className={classes.button}
              borderColor="divider"
              variant="outlined"
              startIcon={<Icon icon="chevron-left" />}
              onClick={handleGoBack}
            >
              Back
            </Button>
          }
        />
      </Box>
      <ModalConfirmationMessage
        title="Invalid data"
        icon="times-circle"
        variant="warning"
        width="100%"
        backdropStyles={{ top: 0 }}
        submitButtonText="OK, got it"
        isOpen={isFileRejected}
        onSubmit={handleCloseModal}
      >
        <Typography className="Body-Regular-Left-Static">
          We could not import the file as required fields are missing data. Please review all fields are filled
          correctly and try importing again.
        </Typography>
        <Link
          className={classes.link}
          target="_blank"
          href="https://help.alyce.com/article/110-how-to-add-a-team-member-in-alyce"
        >
          Learn more
        </Link>
      </ModalConfirmationMessage>
    </StepSection>
  );
};

export default memo(ChooseFile);
