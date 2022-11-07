import React, { memo } from 'react';
import { Link, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, SettingsLayout } from '@alycecom/modules';
import { AlyceTheme, DynamicBreadcrumbs, DynamicBreadcrumbsProvider, Sidebar } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import SettingsAppBar from '../../SettingsAppBar/SettingsAppBar';
import SettingsCreateCampaign from '../../CampaignSettingsModule/SettingsCreateCampaign/SettingsCreateCampaign';
import { StandardCampaignRoutes } from '../routePaths';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  breadcrumbItem: {
    color: palette.link.main,
  },
  lastBreadcrumbItem: {
    color: palette.primary.main,
    fontWeight: 700,
  },
}));

const CreateStandardCampaignPage = () => {
  const classes = useStyles();
  const user = useSelector(User.selectors.getUser);

  return (
    <DynamicBreadcrumbsProvider>
      <SettingsAppBar
        breadcrumbs={
          <DynamicBreadcrumbs
            aria-label="breadcrumbs"
            separator=">"
            item={Link}
            itemProps={{ className: classes.breadcrumbItem, to: '/' }}
            finalItemProps={{ className: classes.lastBreadcrumbItem }}
          />
        }
      />
      <SettingsLayout sidebar={<Sidebar userName={user.firstName} avatarUrl={user.avatar} baseUrl="" items={[]} />}>
        <Route
          exact
          path={StandardCampaignRoutes.buildCreateUrl()}
          render={() => <SettingsCreateCampaign parentUrl="/settings/campaigns" />}
        />
      </SettingsLayout>
    </DynamicBreadcrumbsProvider>
  );
};

export default memo(CreateStandardCampaignPage);
