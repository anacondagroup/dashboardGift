import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
import { DashboardIcon, Divider } from '@alycecom/ui';

import { SWAG_SELECT_FLOW_STATES } from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import alyceLogo from '../../../../../../../../assets/images/alyce-logo-one-color.svg';

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

const ChooseSwagFulfillmentSection = ({ title, order, status, data, campaignId }) => {
  const classes = useStyles();

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.name}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.name}
      </SkippedSection>
    );
  }

  return (
    <>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box pt={1} className={classes.description}>
          Before we set up your swag marketplace for this campaign, we need to figure out which vendor you will be using
          as fulfillment.
        </Box>
      </Box>
      <Box px={3} pt={3}>
        <Box>
          <Box ml={2} className={classes.menuItem} onClick={() => {}}>
            <Box mr={2} height="60px">
              <img src={alyceLogo} alt="alyce-logo" />
            </Box>
            <Box display="flex" flexDirection="column" pr={3}>
              <Box className="Body-Medium-Link">Use Alyce as fulfillment</Box>
              <Box className={classes.description} mt={0.5}>
                Generate unique codes that can be downloaded via a CSV and can be given to your recipients however you
                choose.
              </Box>
            </Box>
            <DashboardIcon color="link" icon="chevron-right" />
          </Box>
          <Box mt={3} mb={3}>
            <Divider my={1} />
          </Box>
          <Box ml={2} className={classes.menuItem} onClick={() => {}}>
            <Box mr={2} height="60px" display="flex">
              <DashboardIcon color="link" size="lg" icon="store" />
            </Box>
            <Box display="flex" flexDirection="column" pr={3}>
              <Box className="Body-Medium-Link">Use your own vendor as fulfillment</Box>
              <Box className={classes.description} mt={0.5}>
                Have your own vendor? Great! Let us know who they are and we’ll work with them to get your swag into the
                marketplace.
              </Box>
            </Box>
            <DashboardIcon color="link" icon="chevron-right" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

ChooseSwagFulfillmentSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
};

ChooseSwagFulfillmentSection.defaultProps = {
  data: {},
  campaignId: undefined,
};

export default ChooseSwagFulfillmentSection;
