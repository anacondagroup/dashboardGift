import React, { memo, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ActivateCampaignRoutes } from './routePaths';
import EditActivatePage from './components/EditActivatePage/EditActivatePage';
import { clearActivateModuleState } from './store/activate.actions';

const EditActivateModule = () => {
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(clearActivateModuleState());
    },
    [dispatch],
  );

  return (
    <Switch>
      <Route exact path={ActivateCampaignRoutes.editorPath} component={EditActivatePage} />
    </Switch>
  );
};

export default memo(EditActivateModule);
