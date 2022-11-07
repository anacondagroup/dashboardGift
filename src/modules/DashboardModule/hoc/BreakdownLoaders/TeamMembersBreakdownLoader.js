import * as R from 'ramda';
import { connect } from 'react-redux';

import {
  getTeamMembersBreakdown,
  getTeamMembersIsLoading,
  getTeamMembersIsLoaded,
} from '../../store/breakdowns/teamMembers/teamMembers.selectors';
import { teamMembersLoadRequest } from '../../store/breakdowns/teamMembers/teamMembers.actions';
import MemoLoader from '../../../../hoc/MemoLoader/MemoLoader';
import { getStateUpdatedTimeState } from '../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';

const pickMemoProps = R.pick([
  'dateRangeFrom',
  'dateRangeTo',
  'sort',
  'sortDirection',
  'search',
  'teamId',
  'campaignId',
  'forceUpdate',
]);
const pickRenderProps = R.pick([
  'breakdown',
  'dateRangeFrom',
  'dateRangeTo',
  'sort',
  'sortDirection',
  'search',
  'isLoading',
  'isLoaded',
]);

const mapStateToProps = state => ({
  isLoading: getTeamMembersIsLoading(state),
  isLoaded: getTeamMembersIsLoaded(state),
  breakdown: getTeamMembersBreakdown(state),
  forceUpdate: getStateUpdatedTimeState(state),
});

const mapDispatchToProps = { load: teamMembersLoadRequest };

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getLoadArgs: pickMemoProps,
  getMemoProps: R.compose(R.values, pickMemoProps),
  getRenderProps: pickRenderProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemoLoader);
