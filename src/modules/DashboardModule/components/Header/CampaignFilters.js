import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { campaignShape, Features, RecipientExperienceFlowLink } from '@alycecom/modules';
import { DateRangeSelect, Icon } from '@alycecom/ui';
import { Link } from 'react-router-dom';
import { Grid, Box, MenuItem } from '@mui/material';

import HasPermission from '../../../../hoc/HasPermission/HasPermission';
import { PermissionKeys } from '../../../../constants/permissions.constants';
import { deleteAllGiftsFromTransferSelection } from '../../store/breakdowns/giftTransfer/giftTransfer.actions';
import SelectFilter from '../../../../components/Dashboard/Header/SelectFilter';
import { CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';
import { ActivateCampaignRoutes } from '../../../ActivateModule/routePaths';
import { ProspectingCampaignRoutes } from '../../../ProspectingCampaignModule/routePaths';
import { StandardCampaignRoutes } from '../../../SettingsModule/components/StandardCampaignModule/routePaths';

const CampaignFilters = ({
  onCampaignChange,
  onFilterChange,
  campaignId,
  dateRangeFrom,
  dateRangeTo,
  campaigns,
  isLoading,
  canEditCampaign,
}) => {
  const dispatch = useDispatch();

  const hasAlyceForMarketingFeature = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.ALYCE_FOR_MARKETING),
  );

  const targetCampaign = useMemo(() => campaigns.find(campaignItem => campaignItem.id === campaignId), [
    campaigns,
    campaignId,
  ]);

  const activateUrl =
    hasAlyceForMarketingFeature && targetCampaign && targetCampaign.type === CAMPAIGN_TYPES.ACTIVATE
      ? ActivateCampaignRoutes.buildEditorUrl(targetCampaign.id)
      : '';
  const prospectingUrl =
    targetCampaign && targetCampaign.type === CAMPAIGN_TYPES.PROSPECTING
      ? ProspectingCampaignRoutes.buildEditorUrl(targetCampaign.id)
      : '';

  const campaignSettingsUrl = activateUrl || prospectingUrl || StandardCampaignRoutes.buildEditorUrl(campaignId);

  const handleCampaignChange = useCallback(
    event => {
      dispatch(deleteAllGiftsFromTransferSelection());
      onCampaignChange(event.campaignId);
    },
    [dispatch, onCampaignChange],
  );

  const handleDatesChange = useCallback(
    event => {
      dispatch(deleteAllGiftsFromTransferSelection());
      onFilterChange(event);
    },
    [dispatch, onFilterChange],
  );

  return (
    <Grid item container direction="column" alignItems="flex-end" justifyContent="center" xs={5}>
      <Box display="flex" flexDirection="flex-end" alignItems="center">
        {canEditCampaign && (
          <HasPermission permissionKey={PermissionKeys.EditCampaigns}>
            <Box className="Body-Regular-Center-Link-Bold" pr={2} display="flex" flexDirection="row">
              <Box pr={1}>
                <Icon icon="cog" color="inherit" />
              </Box>
              <Link to={campaignSettingsUrl}>Edit campaign</Link>
            </Box>
          </HasPermission>
        )}
        <SelectFilter
          disabled={isLoading}
          label="All campaigns"
          value={campaignId}
          name="campaignId"
          onFilterChange={handleCampaignChange}
          renderItems={() =>
            campaigns.map(campaign => (
              <MenuItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </MenuItem>
            ))
          }
        />
        <Box ml={1}>
          <DateRangeSelect disabled={isLoading} from={dateRangeFrom} to={dateRangeTo} onChange={handleDatesChange} />
        </Box>
      </Box>
      <Box mt={1}>
        <RecipientExperienceFlowLink
          apiHost={window.APP_CONFIG.apiHost}
          campaignId={campaignId}
          endIcon={<Icon icon="external-link" fontSize={1} />}
        />
      </Box>
    </Grid>
  );
};

CampaignFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onCampaignChange: PropTypes.func.isRequired,
  campaigns: PropTypes.arrayOf(campaignShape).isRequired,
  campaignId: PropTypes.number,
  dateRangeFrom: PropTypes.string,
  dateRangeTo: PropTypes.string,
  isLoading: PropTypes.bool,
  canEditCampaign: PropTypes.bool,
};

CampaignFilters.defaultProps = {
  campaignId: 0,
  dateRangeFrom: '',
  dateRangeTo: '',
  isLoading: false,
  canEditCampaign: false,
};

export default memo(CampaignFilters);
