import React, { memo, ReactElement, useCallback, useMemo } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Features } from '@alycecom/modules';
import { push } from 'connected-react-router';

import HasPermission from '../../../../hoc/HasPermission/HasPermission';
import { PermissionKeys } from '../../../../constants/permissions.constants';
import {
  getCampaignId,
  getCampaignMarketplaceId,
  getCampaignType,
  getIsUserCanEditCampaign,
} from '../../store/campaignSettings/campaignSettings.selectors';
import { resetCampaignSettings } from '../../store/campaignSettings/campaignSettings.actions';
import { useCampaignMarketplace } from '../../hooks/useCampaignMarketplace';
import { resetProductsState, setPage } from '../../store/products/products.actions';
import { campaignSettingsFormDefaultValues } from '../../store/campaignSettings/campaignSettings.schemas';
import { TCampaignMarketplaceForm } from '../../store/campaignSettings/campaignSettings.types';
import MarketplacesList from '../MarketplacesList/MarketplacesList';
import { MARKETPLACE_ROUTES } from '../../routePaths';
import { ActivateCampaignRoutes } from '../../../ActivateModule/routePaths';
import { CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';
import { MarketplaceMode } from '../../types';
import {
  StandardCampaignEditorSubTabs,
  StandardCampaignEditorTabs,
  StandardCampaignRoutes,
} from '../../../SettingsModule/components/StandardCampaignModule/routePaths';

export interface IMarketplaceHeaderProps {
  onCreateMarketplaceClick?: () => void;
}

const MarketplaceHeader = ({ onCreateMarketplaceClick }: IMarketplaceHeaderProps): ReactElement => {
  const { campaignId: routeCampaignId } = useCampaignMarketplace();
  const dispatch = useDispatch();
  const history = useHistory();
  const { reset } = useFormContext<TCampaignMarketplaceForm>();

  const canEditCampaign = useSelector(getIsUserCanEditCampaign);
  const customMarketplaceId = useSelector(getCampaignMarketplaceId);
  const campaignId = useSelector(getCampaignId);
  const campaignType = useSelector(getCampaignType);
  const isA4MEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlags(Features.FLAGS.ALYCE_FOR_MARKETING), []),
  );

  const hasCampaign = !!routeCampaignId;

  const handleResetButtonClick = useCallback(() => {
    dispatch(resetProductsState());
    dispatch(resetCampaignSettings());
    dispatch(setPage(1));
    history.push(MARKETPLACE_ROUTES.buildCampaignPath());
    reset(campaignSettingsFormDefaultValues);
  }, [history, dispatch, reset]);

  const handleClickCampaignSettings = () => {
    if ([CAMPAIGN_TYPES.A4M, CAMPAIGN_TYPES.ACTIVATE].includes(campaignType) && isA4MEnabled) {
      dispatch(push(ActivateCampaignRoutes.buildEditorUrl(campaignId)));
      return;
    }

    if ([CAMPAIGN_TYPES.SWAG_DIGITAL, CAMPAIGN_TYPES.SWAG_PHYSICAL].includes(campaignType)) {
      dispatch(
        push(
          StandardCampaignRoutes.buildEditorUrl(
            campaignId,
            StandardCampaignEditorTabs.SettingsAndPermissions,
            StandardCampaignEditorSubTabs.SwagInvites,
          ),
        ),
      );
      return;
    }

    dispatch(
      push(
        StandardCampaignRoutes.buildEditorUrl(
          campaignId,
          StandardCampaignEditorTabs.SettingsAndPermissions,
          StandardCampaignEditorSubTabs.GiftInvites,
        ),
      ),
    );
  };

  return (
    <Box data-testid="MarketplaceHeader.Wrapper" bgcolor="background.default" px={4} py={4}>
      <Box display="flex" height={80} alignItems="center">
        <Typography className="H2-Chambray">Marketplace</Typography>
        <Box pl={4} pr={2} width={400} position="relative">
          <MarketplacesList />
        </Box>
        <Fade in={hasCampaign}>
          <div>
            <Button
              data-testid="MarketplaceHeader.ReturnToAllProductsButton"
              onClick={handleResetButtonClick}
              variant="text"
            >
              Return to All Products
            </Button>
          </div>
        </Fade>
        <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
          {!hasCampaign && (
            <HasPermission permissionKey={PermissionKeys.EditTeams}>
              <Button color="secondary" startIcon={<Icon icon="plus" />} onClick={onCreateMarketplaceClick}>
                Create New Marketplace
              </Button>
            </HasPermission>
          )}
          <Box display="flex" alignItems="center">
            <HasPermission permissionKey={PermissionKeys.EditCampaigns}>
              <Fade in={canEditCampaign} mountOnEnter unmountOnExit>
                <div>
                  <Button variant="text" startIcon={<Icon icon="cog" />} onClick={handleClickCampaignSettings}>
                    Campaign Settings
                  </Button>
                </div>
              </Fade>
              <Fade in={!!customMarketplaceId && canEditCampaign} mountOnEnter unmountOnExit>
                <div>
                  <Button
                    variant="text"
                    startIcon={<Icon icon="store" />}
                    href={
                      customMarketplaceId
                        ? MARKETPLACE_ROUTES.buildCustomPath(customMarketplaceId, MarketplaceMode.Edit)
                        : ''
                    }
                  >
                    Marketplace Settings
                  </Button>
                </div>
              </Fade>
            </HasPermission>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(MarketplaceHeader);
