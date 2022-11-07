import { matchPath } from 'react-router-dom';

export const getInvitationParams = () => {
  const { params: { 0: context, id } = {} } =
    matchPath(window.location.pathname, { path: '/(campaigns|teams)/:id/' }) || {};

  return { context, id };
};
