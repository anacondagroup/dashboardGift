import React, { memo, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import CreateActivatePage from './components/CreateActivatePage/CreateActivatePage';
import { ActivateCampaignRoutes } from './routePaths';
import { clearActivateModuleState } from './store/activate.actions';

const CreateActivateModule = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(clearActivateModuleState());
    },
    [dispatch],
  );

  return (
    <Switch>
      <Route exact path={`${ActivateCampaignRoutes.builderPath}`} component={CreateActivatePage} />
    </Switch>
  );
};

export default memo(CreateActivateModule);
