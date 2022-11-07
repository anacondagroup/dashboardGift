import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';

const MemoLoaderComponent = memo(
  ({ load, getLoadArgs, getMemoProps, getRenderProps, render, onUnmount = () => {}, ...rest }) => {
    useEffect(() => {
      load(getLoadArgs(rest));
      return () => {
        onUnmount();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, getMemoProps(rest));

    return render(getRenderProps(rest));
  },
);

MemoLoaderComponent.propTypes = {
  load: PropTypes.func.isRequired,
  getLoadArgs: PropTypes.func.isRequired,
  getMemoProps: PropTypes.func.isRequired,
  getRenderProps: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  onUnmount: PropTypes.func,
};

MemoLoaderComponent.defaultProps = {
  onUnmount: () => {},
};

export default MemoLoaderComponent;
