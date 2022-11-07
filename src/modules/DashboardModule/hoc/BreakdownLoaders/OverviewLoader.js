import * as R from 'ramda';
import { connect } from 'react-redux';

import { overviewLoadRequest } from '../../store/overview/overview.actions';
import { overviewApiParams, overviewSelector } from '../../store/overview/overview.selectors';
import MemoLoader from '../../../../hoc/MemoLoader/MemoLoader';
import { getStateUpdatedTimeState } from '../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';

const pickMemoProps = props => ({ ...overviewApiParams(props), ...R.pick(['forceUpdate'], props) });
const pickRenderProps = R.pick(['kpi', 'statuses', 'isLoading', 'teamId', 'campaignId', 'total', 'forceUpdate']);

const mapStateToProps = state => ({
  ...overviewSelector(state),
  forceUpdate: getStateUpdatedTimeState(state),
});

const mapDispatchToProps = { load: overviewLoadRequest };

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getLoadArgs: pickMemoProps,
  getMemoProps: R.compose(R.values, pickMemoProps),
  getRenderProps: pickRenderProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemoLoader);
