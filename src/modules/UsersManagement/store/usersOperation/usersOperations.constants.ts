import { UserRoles } from '../usersManagement.types';

import { UsersSidebarStep } from './usersOperation.types';

export const USERS_CREATING_STEPS = {
  [UsersSidebarStep.userInfo]: {
    title: 'Add new users individually',
    subTitle: '',
  },
  [UsersSidebarStep.assignRoles]: {
    title: 'Assign user access',
    subTitle: 'By default, users have basic access which enables them to send gifts.',
  },
  [UsersSidebarStep.editUser]: {
    title: 'Assign user access',
    subTitle: 'By default, users have basic access which enables them to send gifts.',
  },
  [UsersSidebarStep.chooseFile]: {
    title: 'Choose a file to import users',
    subTitle: 'Import their info from a file.',
  },
  [UsersSidebarStep.importedUsersInfo]: {
    title: 'Imported users information',
    subTitle: 'You will be able to assign them different access once the invite has been send.',
  },
};

export const USER_ROLES_LIST = [
  { id: UserRoles.member, name: 'Member' },
  { id: UserRoles.admin, name: 'Admin' },
];
