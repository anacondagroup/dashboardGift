import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField } from '@mui/material';
import { DashboardIcon } from '@alycecom/ui';

import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import {
  SS_CAMPAIGN_NAME_STEP,
  SS_OWNERSHIP_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagSelectChangeStep,
  swagSelectSetStepData,
  swagSelectUpdateCampaignNameRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 145,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const CampaignNameSection = ({ title, order, status, data, campaignId, isLoading }) => {
  const classes = useStyles();
  const [campaignName, setCampaignName] = useState(data.campaignName || '');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleOnChangeName = useCallback(
    ev => {
      const trimmedName = ev.target.value.trimStart();
      setCampaignName(trimmedName);
      if (!trimmedName) {
        setError('Campaign name is required');
      } else if (trimmedName.length < 3 || trimmedName.length > 50) {
        setError('Value should be from 3 to 50 characters');
      } else {
        setError('');
      }
    },
    [setError, setCampaignName],
  );

  const handleEdit = useCallback(() => {
    dispatch(swagSelectChangeStep({ current: undefined, next: SS_CAMPAIGN_NAME_STEP }));
  }, [dispatch]);

  const handleNextStep = useCallback(() => {
    if (data.campaignName === campaignName || isLoading) {
      dispatch(swagSelectChangeStep({ next: SS_OWNERSHIP_STEP }));
      return;
    }
    if (campaignId) {
      dispatch(
        swagSelectSetStepData({
          step: SS_CAMPAIGN_NAME_STEP,
          data: { campaignName },
        }),
      );
      dispatch(swagSelectUpdateCampaignNameRequest(campaignId));
    } else {
      dispatch(
        swagSelectChangeStep({ current: SS_CAMPAIGN_NAME_STEP, next: SS_OWNERSHIP_STEP, data: { campaignName } }),
      );
    }
  }, [campaignName, campaignId, data, isLoading, dispatch]);

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        {data.campaignName}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        {data.campaignName}
      </SkippedSection>
    );
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box pt={1} className={classes.description}>
          Set what you want this campaign to be referred to through your Alyce dashboard.
        </Box>
      </Box>
      <Box px={3}>
        <Box>
          <TextField
            fullWidth
            error={!!error}
            helperText={error}
            label="Add a campaign name"
            variant="outlined"
            margin="normal"
            value={campaignName}
            onChange={handleOnChangeName}
            required
          />
        </Box>
        <Box width="100%" mt={2} display="flex" justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleNextStep}
            fullWidth
            disabled={!campaignName || !!error}
          >
            Next step
            {!isLoading ? (
              <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            ) : (
              <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

CampaignNameSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
  isLoading: PropTypes.bool,
};

CampaignNameSection.defaultProps = {
  data: {},
  campaignId: undefined,
  isLoading: false,
};

export default CampaignNameSection;
