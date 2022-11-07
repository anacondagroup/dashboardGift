import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Divider, FlatButton } from '@alycecom/ui';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useRouting } from '@alycecom/hooks';

import { addressToString, SWAG_SELECT_FLOW_STATES } from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import swagCongratulation from '../../../../../../../../assets/images/swag-congratulation.svg';
import { createCampaignSidebarClose } from '../../../../../../store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import { getSwagSelectCardsOrderData } from '../../../../../../store/campaign/swagSelect/swagSelect.selectors';
import { StandardCampaignRoutes } from '../../../../../StandardCampaignModule/routePaths';

import OrderStatusesPipeline from './OrderStatusesPipeline';

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
  linkButton: {
    display: 'inline-block',
  },
}));

const ORDER_STATUSES = address => [
  {
    id: 1,
    title: `Designs shipped to vendor @ ${moment().add(14, 'd').format('hh:mma [on] L')}`,
    completed: true,
  },
  {
    id: 2,
    title: 'Cards queued for printing',
    completed: false,
  },
  {
    id: 3,
    title: 'Cards being printed',
    completed: false,
  },
  {
    id: 4,
    type: 'address',
    title: `Cards being shipped to ${address}`,
    completed: false,
  },
  {
    id: 5,
    title: 'Cards delivered!',
    completed: false,
  },
];

const OrderCardsStatusSection = ({ title, order, status, data, campaignId, getOrderData }) => {
  const classes = useStyles();
  const go = useRouting();
  const dispatch = useDispatch();
  const { deliveryAddress } = useSelector(getOrderData);

  const handleCloseAndGoToSettings = useCallback(() => {
    go(StandardCampaignRoutes.buildEditorUrl(campaignId));
    dispatch(createCampaignSidebarClose());
  }, [campaignId, go, dispatch]);

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId}>
        Card configured
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
    <Box width="600px" px={3}>
      <Typography className="H4-Chambray">{title}</Typography>

      <Box mt={4} textAlign="center">
        <img width={320} src={swagCongratulation} alt="Congratulation" />
      </Box>

      <Box className={classes.description}>
        Now that you have confirmed your cards, we’re in the process of getting them printed! Want to print more cards?
        You can add more to this campaign after you save your campaign.
      </Box>

      <Divider mt={3} mb={3} />

      <Typography className="Body-Medium-Static">Order status</Typography>

      <Box mt={2}>
        <OrderStatusesPipeline statuses={ORDER_STATUSES(addressToString(deliveryAddress))} />
      </Box>

      <Divider mt={6} mb={6} />

      <Box textAlign="center">
        <FlatButton className={classes.linkButton} onClick={handleCloseAndGoToSettings}>
          Close and view all campaign settings
        </FlatButton>
      </Box>
    </Box>
  );
};

OrderCardsStatusSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
  getOrderData: PropTypes.func,
};

OrderCardsStatusSection.defaultProps = {
  data: {},
  campaignId: undefined,
  getOrderData: getSwagSelectCardsOrderData,
};

export default OrderCardsStatusSection;
