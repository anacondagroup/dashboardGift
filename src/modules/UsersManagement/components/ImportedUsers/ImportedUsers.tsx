import React, { useCallback, memo } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, Button } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import StepSection from '../StepSection';
import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setUsersSidebarStep } from '../../store/usersOperation/usersOperation.actions';
import { getHasUserDraftsWithErrors, getUserDraftsCount } from '../../store/entities/userDrafts/userDrafts.selectors';
import { resetUserDrafts } from '../../store/entities/userDrafts/userDrafts.actions';

import UserDraftsTable from './UserDraftsTable';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  button: {
    width: 130,
    height: 48,
    marginRight: spacing(1),
  },
}));

const ImportedUsers = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userDraftsCount = useSelector(getUserDraftsCount);
  const hasErrors = useSelector(getHasUserDraftsWithErrors);

  const handleGoBack = useCallback(() => {
    dispatch(resetUserDrafts());
    dispatch(setUsersSidebarStep(UsersSidebarStep.chooseFile));
  }, [dispatch]);
  const handleGoNext = useCallback(() => dispatch(setUsersSidebarStep(UsersSidebarStep.assignRoles)), [dispatch]);

  const isNextButtonDisabled = userDraftsCount === 0 || hasErrors;

  return (
    <StepSection step={UsersSidebarStep.importedUsersInfo}>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="calc(100vh - 222px)">
        <UserDraftsTable />
        <StepSectionFooter
          stepNumber={3}
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
          nextButton={
            <Button
              className={classes.button}
              borderColor="divider"
              variant="outlined"
              startIcon={<Icon icon="chevron-right" />}
              onClick={handleGoNext}
              disabled={isNextButtonDisabled}
            >
              Next
            </Button>
          }
        />
      </Box>
    </StepSection>
  );
};

export default memo(ImportedUsers);
