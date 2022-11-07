import React, { memo, useMemo, useState } from 'react';
import { Box, Grid, Menu, MenuItem } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';
import { useHistory, useLocation } from 'react-router-dom';

import { ROI_ROUTES } from '../../../routePaths';
import { RoiFilters } from '../RoiFilters';

const MENU_ITEMS = [
  {
    label: 'ROI Reporting',
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
    pt: 1,
    pb: 3,
  },

  titleButton: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: '1.17',
    color: 'primary.main',
    background: 'transparent',
    paddingTop: 0,
  },

  menuItem: {},
} as const;

const RoiDashboardHeader = (): JSX.Element => {
  const { pathname } = useLocation();
  const { push } = useHistory();

  const selectedMenuItem = useMemo(
    () => [...MENU_ITEMS].reverse().find(menuItem => pathname.includes(menuItem.value)),
    [pathname],
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuItemWidth, setMenuItemWidth] = useState(120);

  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuItemWidth(event.currentTarget.clientWidth);
  };
  const handleMenuItemClick = (menuItem: typeof MENU_ITEMS[number]) => {
    setAnchorEl(null);
    push(menuItem.value);
  };

  return (
    <Grid container sx={styles.container}>
      <Grid item xs="auto" alignItems="flex-start">
        <Button sx={styles.titleButton} onClick={handleMenuClick}>
          <Box mr={2}>{selectedMenuItem?.label}</Box>
          <Icon icon="angle-down" fontSize={2} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuItemClick}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {MENU_ITEMS.map(menuItem => (
            <MenuItem key={menuItem.value} onClick={() => handleMenuItemClick(menuItem)} sx={{ width: menuItemWidth }}>
              {menuItem.label}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
      <RoiFilters />
    </Grid>
  );
};

export default memo(RoiDashboardHeader);
