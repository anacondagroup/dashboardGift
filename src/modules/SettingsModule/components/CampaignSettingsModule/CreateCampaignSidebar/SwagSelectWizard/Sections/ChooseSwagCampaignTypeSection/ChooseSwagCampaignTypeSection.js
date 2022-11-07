import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
import { DashboardIcon, Divider } from '@alycecom/ui';
import { useDispatch } from 'react-redux';

import {
  SS_CAMPAIGN_TYPE_STEP,
  SS_CAMPAIGN_NAME_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagSelectChangeStep,
  swagSelectSetCampaignType,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
    lineHeight: 1.29,
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
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

const PHYSICAL_GIFT_TYPE = 'Physical';
const DIGITAL_GIFT_TYPE = 'Digital';

const ChooseSwagCampaignTypeSection = ({ title, order, status, data, campaignId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleNext = useCallback(
    campaignType => {
      dispatch(
        swagSelectChangeStep({
          current: SS_CAMPAIGN_TYPE_STEP,
          next: SS_CAMPAIGN_NAME_STEP,
          data: { campaignType },
        }),
      );
      dispatch(swagSelectSetCampaignType(campaignType));
    },
    [dispatch],
  );

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId}>
        {`${data.campaignType} card campaign`}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.campaignType}
      </SkippedSection>
    );
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        What type of campaign do you want to create?
      </Box>
      <Box px={3} pt={3}>
        <Box>
          <Box className={classes.menuItem} onClick={() => handleNext(PHYSICAL_GIFT_TYPE)}>
            <Box mr={2} height="60px" display="flex">
              <DashboardIcon color="link" size="lg" icon={['far', 'mail-bulk']} />
            </Box>
            <Box display="flex" flexDirection="column" pr={3}>
              <Box className="Body-Medium-Link">Physical card campaign</Box>
              <Box className={classes.description} mt={0.5}>
                Design a card that can be handed out to your recipients where you meet them. Wait time for delivery is
                ~2 weeks.
              </Box>
            </Box>
            <DashboardIcon color="link" icon="chevron-right" />
          </Box>
          <Box mt={3} mb={3}>
            <Divider />
          </Box>
          <Box className={classes.menuItem} onClick={() => handleNext(DIGITAL_GIFT_TYPE)}>
            <Box mr={2} height="60px">
              <DashboardIcon color="link" size="lg" icon={['far', 'list-alt']} />
            </Box>
            <Box display="flex" flexDirection="column" pr={3}>
              <Box className="Body-Medium-Link">Digital code campaign</Box>
              <Box className={classes.description} mt={0.5}>
                Generate unique codes that can be downloaded via a CSV and can be given to your recipients however you
                choose.
              </Box>
            </Box>
            <DashboardIcon color="link" icon="chevron-right" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ChooseSwagCampaignTypeSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
};

ChooseSwagCampaignTypeSection.defaultProps = {
  data: {},
  campaignId: undefined,
};

export default ChooseSwagCampaignTypeSection;
