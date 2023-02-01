import React, { memo, useMemo } from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { AlyceTheme } from '@alycecom/ui';

import { ROI_ROUTES } from '../../../routePaths';
import { RoiFilters } from '../RoiFilters';

const MENU_ITEMS = [
  {
    label: 'Revenue Impact',
    value: ROI_ROUTES.REPORTING,
  },
  {
    label: 'Funnel Influence',
    value: ROI_ROUTES.FUNNEL,
  },
];

const styles = {
  container: {
    justifyContent: 'space-between',
    mt: 1,
    mb: 3,
    borderBottom: 1,
    borderColor: ({ palette }: AlyceTheme) => palette.divider,
  },
  tabs: {
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
  selectedTab: {
    fontWeight: 'bold',
  },
} as const;

const RoiDashboardHeader = (): JSX.Element => {
  const { pathname } = useLocation();
  const { push } = useHistory();

  const selectedMenuItem = useMemo(
    () => [...MENU_ITEMS].reverse().find(menuItem => pathname.includes(menuItem.value)),
    [pathname],
  );

  const handleTabChange = (_: React.SyntheticEvent, newMenuItem: typeof MENU_ITEMS[number]) => {
    push(newMenuItem.value);
  };

  return (
    <Grid container sx={styles.container}>
      <Grid item xs="auto" alignItems="flex-start" alignSelf="end">
        <Tabs value={selectedMenuItem} onChange={handleTabChange} aria-label="Tabs for revenue impact dashboard">
          {MENU_ITEMS.map(menuItem => (
            <Tab
              key={menuItem.value}
              label={
                <Typography sx={[styles.tabs, selectedMenuItem?.value === menuItem.value && styles.selectedTab]}>
                  {menuItem.label}
                </Typography>
              }
              value={menuItem}
            />
          ))}
        </Tabs>
      </Grid>
      <RoiFilters />
    </Grid>
  );
};

export default memo(RoiDashboardHeader);
