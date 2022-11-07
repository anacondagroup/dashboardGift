import { Box, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AlyceTheme, Icon } from '@alycecom/ui';
import React, { memo, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import { TShortCustomMarketplaceCampaign } from '../../store/entities/customMarketplaceCampaigns/customMarketplaceCampaigns.types';
import { getCustomMarketplaceCampaignsMap } from '../../store/entities/customMarketplaceCampaigns/customMarketplaceCampaigns.selectors';
import { getCustomMarketplaceCampaigns } from '../../store/customMarketplace/customMarketplace.selectors';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';
import { ActivateCampaignRoutes } from '../../../ActivateModule/routePaths';
import { fetchCustomMarketplaceCampaignsByIds } from '../../store/entities/customMarketplaceCampaigns/customMarketplaceCampaigns.actions';
import { StandardCampaignRoutes } from '../../../SettingsModule/components/StandardCampaignModule/routePaths';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  usedCampaigns: {
    backgroundColor: palette.secondary.light,
    borderRadius: 5,
    padding: spacing(1, 2),
  },
  infoIcon: {
    color: palette.grey.main,
    fontSize: 16,
    lineHeight: 31,
    margin: spacing(0, 1),
  },
  tooltip: {
    padding: spacing(2),
    backgroundColor: palette.common.white,
    color: palette.text.secondary,
    boxShadow: '0px 1px 12px 1px rgba(0,0,0,0.15)',
    minWidth: 150,
    minHeight: 20,
    fontSize: '14px',
  },
  arrow: {
    fontSize: 25,
    color: palette.common.white,
    '&:before': {
      border: '1px solid rgba(0,0,0,0.15)',
      backgroundColor: palette.common.white,
      left: 'auto',
      right: 0,
    },
  },
}));

const MarketplaceUsage = (): ReactElement => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const campaignMap = useSelector(getCustomMarketplaceCampaignsMap);
  const campaignIds = useSelector(getCustomMarketplaceCampaigns);
  const isMarketplaceUsed = campaignIds && campaignIds.length;
  const hasAlyceForMarketingFeature = useSelector(
    Features.selectors.hasFeatureFlags(Features.FLAGS.ALYCE_FOR_MARKETING),
  );
  useEffect(() => {
    if (isMarketplaceUsed) {
      dispatch(fetchCustomMarketplaceCampaignsByIds(campaignIds));
    }
  }, [dispatch, campaignIds, isMarketplaceUsed]);

  const handleClickCampaignSettings = (targetCampaign: TShortCustomMarketplaceCampaign): string => {
    if (targetCampaign.status === CAMPAIGN_STATUS.ACTIVE) {
      if (targetCampaign.type === CAMPAIGN_TYPES.ACTIVATE && hasAlyceForMarketingFeature) {
        return ActivateCampaignRoutes.buildEditorUrl(targetCampaign.id as number);
      }
      return StandardCampaignRoutes.buildEditorUrl(Number(targetCampaign.id));
    }

    return '';
  };
  return (
    <Box mt={1}>
      {!!isMarketplaceUsed && (
        <Tooltip
          classes={{
            tooltipArrow: classes.tooltip,
            arrow: classes.arrow,
          }}
          title={campaignIds.map(campaign => {
            const targetCampaign: TShortCustomMarketplaceCampaign = campaignMap[campaign];
            if (!targetCampaign || targetCampaign.status !== 'active') {
              return null;
            }
            return (
              <Box key={targetCampaign.id}>
                <Link target="_blank" to={handleClickCampaignSettings(targetCampaign)}>
                  {targetCampaign.name}
                </Link>
              </Box>
            );
          })}
          arrow
          placement="bottom"
        >
          <Box className={classNames('Subcopy-Static', classes.usedCampaigns)}>
            Warning: this is in use by {campaignIds.length} Campaigns
            <Icon icon="info-circle" className={classes.infoIcon} />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default memo(MarketplaceUsage);
