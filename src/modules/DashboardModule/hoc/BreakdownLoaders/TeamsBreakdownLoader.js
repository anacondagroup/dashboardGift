import * as R from 'ramda';
import { connect } from 'react-redux';

import { getTeamsBreakdown, getTeamsIsLoading, getTeamsIsLoaded } from '../../store/breakdowns/teams/teams.selectors';
import { teamsLoadRequest } from '../../store/breakdowns/teams/teams.actions';
import { getStateUpdatedTimeState } from '../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';
import MemoLoader from '../../../../hoc/MemoLoader/MemoLoader';

const pickMemoProps = R.pick([
  'campaignId',
  'dateRangeFrom',
  'dateRangeTo',
  'sort',
  'sortDirection',
  'search',
  'forceUpdate',
  'includeArchived',
]);
const pickRenderProps = R.pick([
  'breakdown',
  'campaignId',
  'dateRangeFrom',
  'dateRangeTo',
  'sort',
  'sortDirection',
  'search',
  'isLoading',
  'isLoaded',
  'includeArchived',
]);

const mapStateToProps = state => ({
  isLoading: getTeamsIsLoading(state),
  isLoaded: getTeamsIsLoaded(state),
  breakdown: getTeamsBreakdown(state),
  forceUpdate: getStateUpdatedTimeState(state),
});

const mapDispatchToProps = { load: teamsLoadRequest };

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getLoadArgs: () => null,
  getMemoProps: R.compose(R.values, pickMemoProps),
  getRenderProps: pickRenderProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemoLoader);
