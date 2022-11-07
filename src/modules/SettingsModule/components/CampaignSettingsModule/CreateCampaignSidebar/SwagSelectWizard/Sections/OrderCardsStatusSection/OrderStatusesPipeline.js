import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import checkImg from '../../../../../../../../assets/images/check.svg';

const useStyles = makeStyles(({ palette, spacing }) => ({
  ul: {
    listStyle: 'none',
    paddingInlineStart: 0,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    zIndex: 1,
  },
  li: {
    position: 'relative',
    marginBottom: spacing(1),
    '&:not(:last-child):after': {
      content: `''`,
      width: 8,
      height: 8,
      position: 'absolute',
      top: 19,
      left: 7,
      borderLeft: `2px dotted ${palette.text.disabled}`,
    },
  },
  liText: {
    fontSize: 14,
    color: palette.grey.main,
    display: 'inline',
    marginLeft: spacing(2),
  },
}));

const CheckStatus = () => <img width={16} height={16} src={checkImg} alt="Check icon" />;
const DotStatus = () => <Box width={16} height={16} borderRadius="50%" border={2} borderColor="text.disabled" />;

export const OrderStatusesPipelineComponent = ({ statuses }) => {
  const classes = useStyles();
  return (
    <Box position="relative">
      <ul className={classes.ul}>
        {statuses.map(({ id, title, completed }) => (
          <li key={id} className={classes.li}>
            <Box display="inline-block">{completed ? <CheckStatus /> : <DotStatus />}</Box>
            <Typography className={[classes.liText, { 'Subcopy-Static': completed }]}>{title}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

OrderStatusesPipelineComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  statuses: PropTypes.array,
};

OrderStatusesPipelineComponent.defaultProps = {
  statuses: [],
};

export default OrderStatusesPipelineComponent;
