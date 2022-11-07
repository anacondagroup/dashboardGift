import * as R from 'ramda';
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon, LoadingLabel } from '@alycecom/ui';
import { Avatar, Collapse, Box, ButtonBase } from '@mui/material';
import { withStyles } from '@mui/styles';

import { statusShape } from '../../shapes/statuses.shape';

import DashboardStatusRow from './DashboardStatusRow';

const styles = theme => ({
  arrowIcon: {
    color: theme.palette.link.main,
  },
  avatar: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 12,
    left: -19,
    border: `4px solid ${theme.palette.common.white}`,
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
    backgroundColor: '#44ada3',
    color: theme.palette.common.white,
  },
  ripple: {
    width: '100%',
    padding: theme.spacing(2.5),
    cursor: 'pointer',
  },
});

export const DashboardStatusesSectionComponent = ({ title, classes, icon, statuses, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const giftsCount = useMemo(() => R.compose(R.sum(), R.pluck('count'))(statuses), [statuses]);

  return (
    <Box width="32%" ml={2} position="relative" data-testid="status-wrapper">
      <Avatar className={classes.avatar}>
        <Icon color="inherit" icon={icon} />
      </Avatar>
      <Box width={1} borderRadius="5px" boxShadow={1} bgcolor="background.paper">
        <ButtonBase className={classes.ripple} onClick={() => setIsOpen(!isOpen)}>
          <Box
            width={1}
            display="flex"
            flexDirection="row"
            flexWrap="nowrap"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Box pl={1.5} className="H4-Chambray">
              {isLoading ? <LoadingLabel width="250" height="24" /> : `${giftsCount} ${title}`}
            </Box>
            <Icon icon={isOpen ? 'chevron-down' : 'chevron-up'} className={classes.arrowIcon} />
          </Box>
        </ButtonBase>
        <Collapse in={isOpen}>
          <Box p={2.5} pt={0}>
            {statuses.map(status => (
              <DashboardStatusRow key={status.title} status={status} />
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

DashboardStatusesSectionComponent.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(statusShape).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withStyles(styles)(DashboardStatusesSectionComponent);
