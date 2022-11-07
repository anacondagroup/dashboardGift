import React, { memo, useEffect } from 'react';
import { makeStyles } from '@mui/styles';

import bellIcon from '../../assets/images/icon-notification.svg';

const useStyles = makeStyles(({ palette, spacing }) => ({
  appcuesLaunchpad: {
    alignSelf: 'center',
    '&>div': {
      paddingLeft: spacing(1.5),
      paddingRight: spacing(1.5),
      paddingTop: spacing(1.25),
      height: spacing(6),
      borderRight: `1px solid ${palette.dividerBlue}`,
    },
    '&>div> .appcues-widget-icon::after': {
      backgroundColor: palette.error.light,
      fontSize: 0,
      height: 12,
      minWidth: 12,
    },
    '&>div> .appcues-widget-icon[data-appcues-count="0"]::after': {
      display: 'none',
    },
  },
}));

const AppcuesTooltip = () => {
  const classes = useStyles();

  useEffect(() => {
    const appcuesInterval = setInterval(() => {
      if (window.Appcues) {
        clearInterval(appcuesInterval);
        clearTimeout(appcuesTimeout);
        window.Appcues?.loadLaunchpad('#appcues-launchpad', {
          position: 'center',
          header: '<p class="Body-Regular-Left-Chambray-Bold" style="margin: 0;">Notifications</p>',
          icon: bellIcon,
        });
      }
    }, 500);

    const appcuesTimeout = setTimeout(() => {
      clearInterval(appcuesInterval);
    }, 5000);

    return () => {
      clearInterval(appcuesInterval);
      clearTimeout(appcuesTimeout);
    };
  }, []);

  return <div id="appcues-launchpad" className={classes.appcuesLaunchpad} />;
};

export default memo(AppcuesTooltip);
