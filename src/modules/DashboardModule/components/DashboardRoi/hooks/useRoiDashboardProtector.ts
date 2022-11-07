import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import {
  getIsSfConnectionStateLoaded,
  getSfConnectionState,
} from '../../../../SettingsModule/store/organisation/integrations/workato/integrations/integrations.selectors';
import { ROI_ROUTES } from '../routePaths';
import { fetchSfConnectionState } from '../../../../SettingsModule/store/organisation/integrations/workato/integrations/integrations.actions';

export const useRoiDashboardProtector = (): {
  isLoaded: boolean;
  isSalesforceConnected: boolean;
  dashboard: string;
} => {
  const dispatch = useDispatch();

  const sfConnectionState = useSelector(getSfConnectionState);
  const isLoaded = useSelector(getIsSfConnectionStateLoaded);

  const dashboard = sfConnectionState === 'connected' ? ROI_ROUTES.FUNNEL : ROI_ROUTES.REPORTING;

  useEffect(() => {
    dispatch(fetchSfConnectionState());
  }, [dispatch]);

  return {
    isLoaded,
    isSalesforceConnected: sfConnectionState === 'connected',
    dashboard,
  };
};
