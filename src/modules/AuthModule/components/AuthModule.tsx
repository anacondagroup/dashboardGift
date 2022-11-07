import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Auth } from '@alycecom/modules';

import AuthConfirmationPage from './AuthConfirmation/AuthConfirmationPage';

const AuthModule = () => (
  <Switch>
    <Route
      exact
      path="/confirm/auth/:token"
      render={({ match }) => <AuthConfirmationPage idToken={match.params.token} />}
    />

    <Route exact path="/login/redirect" component={Auth.LoginRedirect} />
    <Route path="/callback" component={Auth.AuthCallback} />
    <Route path="/access-denied" component={Auth.AccessDenied} />
  </Switch>
);

export default memo(AuthModule);
