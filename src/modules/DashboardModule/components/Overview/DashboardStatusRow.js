import React, { useMemo } from 'react';
import { Icon } from '@alycecom/ui';
import * as numeral from 'numeral';
import { Box } from '@mui/material';

import { statusShape } from '../../shapes/statuses.shape';

export const DashboardStatusRowComponent = React.memo(({ status }) => {
  const value = useMemo(() => (status.count >= 1000 ? numeral(status.count).format('0.0a') : status.count), [status]);

  const color = useMemo(() => {
    if (status.count === 0) {
      return undefined;
    }

    if (status.count > 0 && status.color) {
      return status.color;
    }

    return 'default';
  }, [status.color, status.count]);

  return (
    <Box
      key={status.title}
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      pt={1}
      pb={1}
      data-testid={`status-value ${status.title}`}
    >
      <Box flex={1}>
        <Icon isDefaultCursor icon={status.icon} color={color} />
      </Box>
      <Box flex={2} className="KPI-Small-Dark" mr={2} textAlign="right">
        {value}
      </Box>
      <Box flex={10} className={status.count === 0 ? 'Body-Regular-Left-Inactive' : 'Body-Regular-Left-Chambray-Bold'}>
        {status.title}
      </Box>
    </Box>
  );
});

DashboardStatusRowComponent.propTypes = {
  status: statusShape.isRequired,
};

export default DashboardStatusRowComponent;
