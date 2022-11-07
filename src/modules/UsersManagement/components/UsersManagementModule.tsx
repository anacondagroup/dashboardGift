import React, { memo } from 'react';

import UsersTable from './UsersTable/UsersTable';

const UsersManagementModule = (): JSX.Element => <UsersTable />;

export default memo(UsersManagementModule);
