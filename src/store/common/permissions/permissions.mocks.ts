import { rest } from 'msw';

const getPermissionsMock = rest.get('/enterprise/dashboard/permissions', (req, res, ctx) =>
  res(
    ctx.json({
      success: true,
      permissions: ['edit-campaigns', 'edit-teams', 'organisation-admin', 'access-dashboard'],
    }),
  ),
);

export const permissionsMocks = [getPermissionsMock];
