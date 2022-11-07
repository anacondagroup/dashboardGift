import React from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const arrowSize = '4px';
const styles = ({ palette }) => ({
  arrowLine: {
    borderTop: `1px ${palette.divider} solid`,
    position: 'absolute',
    '&:after': {
      content: '""',
      display: 'block',
      borderTop: `${arrowSize} solid transparent`,
      borderBottom: `${arrowSize} solid transparent`,
      borderLeft: `${arrowSize} solid ${palette.divider}`,
      right: '0',
      position: 'absolute',
      top: `-${arrowSize}`,
      borderRadius: '1px',
    },
  },
  bottomArrowLine: {
    width: '50%',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  verticalLine: {
    height: '100%',
    background: palette.divider,
    width: '1px',
    margin: '0 auto',
  },
});

const LineArrow = ({ classes, double, className }) => (
  <div className={classNames(classes.arrowLine, className)}>
    {double && (
      <>
        <div className={classes.verticalLine} />
        <div className={classNames(classes.arrowLine, classes.bottomArrowLine)} />
      </>
    )}
    <div />
  </div>
);

LineArrow.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  double: PropTypes.bool,
  className: PropTypes.string.isRequired,
};

LineArrow.defaultProps = {
  double: false,
};
export default withStyles(styles)(LineArrow);
