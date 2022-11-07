import React, { memo } from 'react';
import { Box, BoxProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, Tooltip } from '@alycecom/ui';
import classnames from 'classnames';

const useStyles = makeStyles<AlyceTheme, { hasDescription: boolean }>(({ palette, spacing }) => ({
  title: ({ hasDescription }: { hasDescription: boolean }) => ({
    color: `${palette.grey.main}!important`,
    width: '100%',
    marginBottom: hasDescription ? spacing(0.5) : 0,
  }),
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
}));

interface IRestrictedGiftTypeProps extends BoxProps {
  title: string;
  description?: string;
}

const RestrictedGiftType = ({ title, description, ...wrapperProps }: IRestrictedGiftTypeProps): JSX.Element => {
  const classes = useStyles({ hasDescription: !!description });
  return (
    <Box display="flex" width={1} {...wrapperProps}>
      <Box pr={2}>
        <Tooltip title={`${title} locked on the team level`} placement="top-end">
          <Box className={classes.iconWrap}>
            <Icon icon="lock-alt" />
          </Box>
        </Tooltip>
      </Box>
      <Box width={1}>
        <Box className={classnames('H4-Chambray', classes.title)} width={1} mb={description ? 0.5 : 0}>
          {title}
        </Box>
        {description && (
          <Box className="Body-Small-Inactive" width={1}>
            {description}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default memo(RestrictedGiftType);
