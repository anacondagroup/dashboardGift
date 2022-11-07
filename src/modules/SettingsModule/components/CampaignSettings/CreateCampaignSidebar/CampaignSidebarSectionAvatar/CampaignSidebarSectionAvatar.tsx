import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';

import { ACTIVATE_FLOW_STATES } from '../../../../../../constants/activate.constants';

const useStyles = makeStyles<AlyceTheme>(theme => ({
  container: {
    position: 'absolute',
    borderRadius: '50%',
    boxSizing: 'border-box',
  },
  ACTIVE: {
    top: 16,
    left: -35,
    width: 70,
    height: 70,
    backgroundColor: theme.palette.green.dark,
    fontWeight: 700,
    fontSize: 32,
    color: theme.palette.common.white,
    lineHeight: 1,
    border: `4px solid white`,
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  UNTOUCHED: {
    top: 16,
    left: -16,
    width: 30,
    height: 30,
    backgroundColor: theme.palette.text.disabled,
    fontWeight: 700,
    fontSize: 16,
    color: theme.palette.grey.main,
  },
  SKIPPED: {
    top: 8,
    left: -35,
    width: 70,
    height: 70,
    backgroundColor: theme.palette.link.main,
    fontWeight: 700,
    fontSize: 32,
    color: theme.palette.common.white,
    lineHeight: 1,
    border: `4px solid white`,
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  COMPLETED: {
    top: 8,
    left: -35,
    width: 70,
    height: 70,
    backgroundColor: theme.palette.green.fruitSalad,
    fontWeight: 700,
    fontSize: 32,
    color: theme.palette.common.white,
    lineHeight: 1,
    border: `4px solid white`,
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  stateIndicator: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    right: -4,
    bottom: -4,
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: `2px solid white`,
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  indicatorIcon: {
    width: 10,
    height: 10,
  },
  stateIndicator_COMPLETED: {
    backgroundColor: theme.palette.green.fruitSalad,
  },
  stateIndicator_SKIPPED: {
    backgroundColor: theme.palette.link.main,
  },
  stateIndicator_LOCKED: {
    backgroundColor: theme.palette.text.primary,
  },
}));

interface IIconStates {
  COMPLETED: {
    icon: string;
    class: string;
  };
  SKIPPED: {
    icon: string;
    class: string;
  };
  LOCKED: {
    icon: string;
    class: string;
  };
}

const iconStates: IIconStates = {
  COMPLETED: {
    icon: 'check',
    class: 'stateIndicator_COMPLETED',
  },
  SKIPPED: {
    icon: 'pencil',
    class: 'stateIndicator_SKIPPED',
  },
  LOCKED: {
    icon: 'lock',
    class: 'stateIndicator_LOCKED',
  },
};

interface ICampaignSidebarSectionAvatarProps {
  status: typeof ACTIVATE_FLOW_STATES[keyof typeof ACTIVATE_FLOW_STATES];
  avatar: unknown;
}

const CampaignSidebarSectionAvatar = ({ status, avatar }: ICampaignSidebarSectionAvatarProps) => {
  const classes = useStyles();

  const renderStatusIcon = useMemo(() => {
    if (!status || status === ACTIVATE_FLOW_STATES.UNTOUCHED || status === ACTIVATE_FLOW_STATES.ACTIVE) {
      return null;
    }

    return (
      <Box className={classnames(classes.stateIndicator, classes[`stateIndicator_${status}`])}>
        {/* Don't want to add @fortawesome/fontawesome-svg-core into dependencies list of ED */}
        {/* IconProp comes from @fortawesome/fontawesome-svg-core */}
        {/* @ts-ignore */}
        <Icon className={classes.indicatorIcon} icon={iconStates[status].icon} color="white" />
      </Box>
    );
  }, [classes, status]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={classnames(classes.container, classes[status])}
    >
      {avatar}
      {renderStatusIcon}
    </Box>
  );
};

CampaignSidebarSectionAvatar.propTypes = {
  status: PropTypes.oneOf(['ACTIVE', 'UNTOUCHED', 'SKIPPED', 'COMPLETED']).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  avatar: PropTypes.any.isRequired,
};

export default React.memo(CampaignSidebarSectionAvatar);
