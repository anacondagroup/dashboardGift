import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@alycecom/ui';
import { Box } from '@mui/material';

import { statusesShape } from '../../shapes/statuses.shape';

import DashboardStatusesSection from './DashboardStatusesSection';

const DashboardGiftStatuses = ({
  statuses: {
    // eslint-disable-next-line camelcase
    created_and_not_viewed,
    viewed,
    accepted,
    declined,
    /* eslint-enable camelcase */
  },
  isLoading,
}) => (
  <Box display="flex" flexDirection="row" flexWrap="nowrap">
    <DashboardStatusesSection
      icon="truck"
      title="emails created and not yet accepted"
      isLoading={isLoading}
      statuses={[
        {
          icon: 'envelope',
          title: 'Created but not viewed',
          count: created_and_not_viewed,
          color: undefined,
        },
        {
          icon: 'eye',
          title: 'Viewed',
          count: viewed,
          color: 'secondary',
        },
      ]}
    />
    <Box display="flex" ml={2} mr={2} color="divider" height={64} alignItems="center">
      <Icon isDefaultCursor color="inherit" icon="arrow-right" />
    </Box>
    <DashboardStatusesSection
      icon="star"
      title="emails finished"
      isLoading={isLoading}
      statuses={[
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
      ]}
    />
  </Box>
);

DashboardGiftStatuses.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  statuses: statusesShape.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default DashboardGiftStatuses;
