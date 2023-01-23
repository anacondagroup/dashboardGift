import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Divider, Icon } from '@alycecom/ui';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@alycecom/modules';

import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import StepSection from '../StepSection/StepSection';
import { userInfoFormDefaultValues, userInfoFormResolver } from '../../store/usersCreate/usersCreate.schemas';
import { clearExistUser, validateUserInfoRequest } from '../../store/usersCreate/usersCreate.actions';
import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { getErrors, getExistUserId, getIsCreatePending } from '../../store/usersCreate/usersCreate.selectors';
import { setSingleSelectedUser, setUsersSidebarStep } from '../../store/usersOperation/usersOperation.actions';
import UsersInfoList from '../UsersInfoList/UsersInfoList';
import { TUserCreateParams, UsersCreateFieldName } from '../../store/usersCreate/usersCreate.types';
import {
  getFirstUserDraft,
  getUserDraftsCount,
  getUserDrafts,
} from '../../store/entities/userDrafts/userDrafts.selectors';
import { getUsers } from '../../store/users/users.selectors';

import MultipleUsersCreateSection from './MultipleUsersCreateSection';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  step: {
    fontSize: 18,
    color: palette.grey.chambray50,
  },
  nextButton: {
    width: 130,
    height: 48,
    color: palette.link.main,
  },
  addAnotherButton: {
    width: 180,
    height: 48,
    color: palette.link.main,
  },
  error: {
    fontSize: '0.75 rem',
    color: '#d03243',
  },
}));

const UserInfoForm = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsCreatePending);
  const externalErrors = useSelector(getErrors);
  const orgName = useSelector(User.selectors.getOrgName);
  const userDraft = useSelector(getFirstUserDraft);
  const userDrafts = useSelector(getUserDrafts);
  const userDraftsCount = useSelector(getUserDraftsCount);
  const existUserId = useSelector(getExistUserId);
  const users = useSelector(getUsers);

  const hasAddedUsers = userDraftsCount > 0;

  const methods = useForm<TUserCreateParams>({
    mode: 'all',
    defaultValues: userInfoFormDefaultValues,
    resolver: userInfoFormResolver,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    clearErrors,
    reset,
    getValues,
    setValue,
  } = methods;
  const emailField = register(UsersCreateFieldName.email);
  const firstNameField = register(UsersCreateFieldName.firstName);
  const lastNameField = register(UsersCreateFieldName.lastName);
  const companyField = register(UsersCreateFieldName.company);

  const handleEditUser = useCallback(() => {
    const user = users.find(userItem => userItem.id === existUserId);
    if (user) {
      dispatch(setSingleSelectedUser(user));
      dispatch(setUsersSidebarStep(UsersSidebarStep.editUser));
    } else {
      dispatch(clearExistUser());
    }
  }, [dispatch, users, existUserId]);

  const checkUserInfoEmail = useCallback(
    (email: string): boolean => {
      const foundUserIndex = userDrafts.findIndex(user => user.email === email);
      const isEmailExists = foundUserIndex !== -1;
      if (isEmailExists) {
        setError(UsersCreateFieldName.email, { type: 'validation', message: 'This email is already added.' });
      }
      return isEmailExists;
    },
    [userDrafts, setError],
  );

  const handleAddAnotherUser = useCallback(
    (data: TUserCreateParams) => {
      if (checkUserInfoEmail(data.email)) {
        return;
      }
      dispatch(validateUserInfoRequest(data, false));
      reset();
    },
    [dispatch, reset, checkUserInfoEmail],
  );

  const handleNextStep = useCallback(() => {
    const userData = getValues();
    const { email, firstName, lastName } = userData;
    const isFieldsEmpty = email === '' && firstName === '' && lastName === '';
    dispatch(clearExistUser());
    if (hasAddedUsers && isFieldsEmpty) {
      dispatch(setUsersSidebarStep(UsersSidebarStep.assignRoles));
      return;
    }

    if (checkUserInfoEmail(email)) {
      return;
    }

    handleSubmit(data => {
      dispatch(validateUserInfoRequest(data, true));
    })();
  }, [dispatch, getValues, hasAddedUsers, checkUserInfoEmail, handleSubmit]);

  useEffect(() => {
    clearErrors();
    // @ts-ignore
    Object.entries(externalErrors).forEach((item: string[]) => {
      setError(item[0] as UsersCreateFieldName, { type: 'validation', message: item[1] });
    });
  }, [clearErrors, externalErrors, setError]);

  const { email } = errors;

  useEffect(() => {
    const { company = '' } = userDraft || {};
    setValue(UsersCreateFieldName.company, company || orgName);
  }, [orgName, userDraft, setValue]);

  const emailErrorMessage: React.ReactNode = useMemo(() => {
    const message = email?.message;
    const link = existUserId ? (
      <Typography display="inline" className="Body-Regular-Left-Link Text-Pointer" onClick={handleEditUser}>
        <Icon isDefaultCursor color="inherit" icon="arrow-right" /> View user
      </Typography>
    ) : null;
    if (!email) {
      return null;
    }

    return (
      <div>
        {message} {link}
      </div>
    );
  }, [handleEditUser, existUserId, email]);

  return (
    <StepSection step={UsersSidebarStep.userInfo}>
      <form onSubmit={handleSubmit(handleAddAnotherUser)}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="calc(100vh - 200px)">
          <Box width={1}>
            {hasAddedUsers && <UsersInfoList />}
            <Box width={400}>
              <TextField
                inputRef={emailField.ref}
                {...emailField}
                name={UsersCreateFieldName.email}
                fullWidth
                label="Email address *"
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                error={!!errors.email}
                helperText={emailErrorMessage}
                inputProps={{
                  autoComplete: 'off',
                }}
              />
              <TextField
                inputRef={firstNameField.ref}
                {...firstNameField}
                name={UsersCreateFieldName.firstName}
                fullWidth
                label="First name *"
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                error={!!errors.firstName}
                helperText={!!errors.firstName && errors.firstName.message}
                inputProps={{
                  autoComplete: 'off',
                }}
              />
              <TextField
                inputRef={lastNameField.ref}
                {...lastNameField}
                name={UsersCreateFieldName.lastName}
                fullWidth
                label="Last name *"
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                error={!!errors.lastName}
                helperText={!!errors.lastName && errors.lastName.message}
                inputProps={{
                  autoComplete: 'off',
                }}
              />
              <TextField
                inputRef={companyField.ref}
                {...companyField}
                name={UsersCreateFieldName.company}
                fullWidth
                label="Company name *"
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                error={!!errors.company}
                helperText={!!errors.company && errors.company.message}
                inputProps={{
                  autoComplete: 'off',
                }}
              />
              <Button
                className={classes.addAnotherButton}
                disabled={isLoading}
                startIcon={<Icon icon="plus" />}
                type="submit"
              >
                Add another user
              </Button>
            </Box>
            <Divider color="divider" height={2} mt={2} mb={3} />
            <MultipleUsersCreateSection />
          </Box>
          <StepSectionFooter
            stepNumber={1}
            stepsCount={2}
            nextButton={
              <Button
                className={classes.nextButton}
                variant="outlined"
                disabled={isLoading}
                endIcon={<Icon icon="chevron-right" />}
                onClick={handleNextStep}
              >
                Next
              </Button>
            }
          />
        </Box>
      </form>
    </StepSection>
  );
};

export default memo(UserInfoForm);
