/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@alycecom/ui';
import { Box } from '@mui/material';

import { statusesShape } from '../../shapes/statuses.shape';

import DashboardStatusesSection from './DashboardStatusesSection';

const DashboardGiftStatuses = ({
  statuses: {
    created_and_queued_for_research,
    requiring_attention,
    invite_options_ready,
    disabled,
    scheduled_to_be_sent,
    address_being_verified,
    queued_for_shipping,
    awaiting_fulfilment,
    in_transit,
    delivered_but_now_viewed,
    bounced_or_returned,
    viewed,
    expired,
    accepted,
    declined,
    accepted_and_meeting_booked,
  },
  isLoading,
}) => {
  const statusesCreated = useMemo(
    () => [
      {
        icon: 'flask',
        title: 'Created and queued for research',
        count: created_and_queued_for_research,
        color: undefined,
      },
      {
        icon: 'exclamation-circle',
        title: 'Requiring attention',
        count: requiring_attention,
        color: 'secondary',
      },
      {
        icon: 'gift',
        title: 'Invites options are ready',
        count: invite_options_ready,
        color: 'secondary',
      },
      {
        icon: 'ban',
        title: 'Disabled',
        count: disabled,
        color: 'error',
      },
    ],
    [created_and_queued_for_research, disabled, invite_options_ready, requiring_attention],
  );
  const statusesSent = useMemo(
    () => [
      {
        icon: 'clock',
        title: 'Scheduled to be sent',
        count: scheduled_to_be_sent,
        color: undefined,
      },
      {
        icon: 'check',
        title: 'Address being verified',
        count: address_being_verified,
        color: undefined,
      },
      {
        icon: 'cog',
        title: 'Queued for shipping',
        count: queued_for_shipping,
        color: undefined,
      },
      {
        icon: 'box-full',
        title: 'Awaiting fulfilment',
        count: awaiting_fulfilment,
        color: undefined,
      },
      {
        icon: 'shipping-fast',
        title: 'In transit',
        count: in_transit,
        color: undefined,
      },
      {
        icon: 'envelope',
        title: 'Delivered but not viewed',
        count: delivered_but_now_viewed,
        color: 'secondary',
      },
      {
        icon: 'level-up',
        title: 'Bounced or returned',
        count: bounced_or_returned,
        color: 'error',
      },
      {
        icon: 'eye',
        title: 'Viewed',
        count: viewed,
        color: 'secondary',
      },
      {
        icon: 'ban',
        title: 'Expired',
        count: expired,
        color: 'error',
      },
    ],
    [
      address_being_verified,
      awaiting_fulfilment,
      bounced_or_returned,
      delivered_but_now_viewed,
      expired,
      in_transit,
      queued_for_shipping,
      scheduled_to_be_sent,
      viewed,
    ],
  );
  const statusesFinished = useMemo(
    () => [
      {
        icon: 'thumbs-up',
        title: 'Accepted',
        count: accepted,
        color: undefined,
      },
      {
        icon: 'thumbs-down',
        title: 'Declined',
        count: declined,
        color: 'error',
      },
      {
        icon: 'calendar-alt',
        title: 'Accepted & meeting booked',
        count: accepted_and_meeting_booked,
        color: 'secondary',
      },
    ],
    [accepted, accepted_and_meeting_booked, declined],
  );

  return (
    <Box display="flex" flexDirection="row" flexWrap="nowrap">
      <DashboardStatusesSection
        icon="atom-alt"
        title="invites created"
        isLoading={isLoading}
        statuses={statusesCreated}
      />
      <Box display="flex" ml={2} mr={2} color="divider" height={64} alignItems="center">
        <Icon isDefaultCursor color="inherit" icon="arrow-right" />
      </Box>
      <DashboardStatusesSection
        icon="truck"
        title="invites sent and not yet accepted"
        isLoading={isLoading}
        statuses={statusesSent}
      />
      <Box display="flex" ml={2} mr={2} color="divider" height={64} alignItems="center">
        <Icon isDefaultCursor color="inherit" icon="arrow-right" />
      </Box>
      <DashboardStatusesSection
        icon="star"
        title="invites finished"
        isLoading={isLoading}
        statuses={statusesFinished}
      />
    </Box>
  );
};

DashboardGiftStatuses.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  statuses: statusesShape.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default DashboardGiftStatuses;
