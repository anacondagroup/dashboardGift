import React, { memo, useCallback } from 'react';
import { Box, Drawer } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AlyceTheme } from '@alycecom/ui';

import {
  getIsUsersSidebarOpen,
  getSingleSelectedUser,
  getUsersSidebarStep,
} from '../../store/usersOperation/usersOperation.selectors';
import { setUsersSidebarStep } from '../../store/usersOperation/usersOperation.actions';
import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import UserInfoForm from '../UserInfoForm/UserInfoForm';
import AssignRolesForm from '../AssignRolesForm/AssignRolesForm';
import EditUserForm from '../EditUserForm/EditUserForm';
import ChooseFile from '../ChooseFile';
import ImportedUsers from '../ImportedUsers';

import UsersSidebarHeader from './UsersSidebarHeader';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  paper: {
    backgroundColor: palette.common.white,
  },
}));

const UsersSidebar = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isOpen = useSelector(getIsUsersSidebarOpen);
  const step = useSelector(getUsersSidebarStep);
  const selectedUser = useSelector(getSingleSelectedUser);

  const sidebarTitle =
    selectedUser && step === UsersSidebarStep.editUser
      ? `Edit ${selectedUser.firstName} ${selectedUser.lastName}`
      : 'Create users';

  const handleCloseSidebar = useCallback(() => {
    dispatch(setUsersSidebarStep(null));
  }, [dispatch]);

  return (
    <Drawer classes={{ paper: classes.paper }} anchor="right" open={isOpen} onBackdropClick={handleCloseSidebar}>
      <Box width={600}>
        <UsersSidebarHeader title={sidebarTitle} onClose={handleCloseSidebar} />
        <>
          {step === UsersSidebarStep.userInfo && <UserInfoForm />}
          {step === UsersSidebarStep.assignRoles && <AssignRolesForm />}
          {step === UsersSidebarStep.editUser && <EditUserForm />}
          {step === UsersSidebarStep.chooseFile && <ChooseFile />}
          {step === UsersSidebarStep.importedUsersInfo && <ImportedUsers />}
        </>
      </Box>
    </Drawer>
  );
};

export default memo(UsersSidebar);
