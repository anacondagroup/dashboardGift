import * as R from 'ramda';
import { connect } from 'react-redux';

import {
  getCampaignsBreakdown,
  getCampaignsIsLoading,
  getCampaignsIsLoaded,
} from '../../store/breakdowns/campaigns/campaigns.selectors';
import { campaignsLoadRequest } from '../../store/breakdowns/campaigns/campaigns.actions';
import MemoLoader from '../../../../hoc/MemoLoader/MemoLoader';
import { getStateUpdatedTimeState } from '../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';

const pickMemoProps = R.pick([
  'dateRangeFrom',
  'dateRangeTo',
  'sort',
  'sortDirection',
  'search',
  'teamId',
  'forceUpdate',
  'memberId',
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
  isLoading: getCampaignsIsLoading(state),
  breakdown: getCampaignsBreakdown(state),
  forceUpdate: getStateUpdatedTimeState(state),
  isLoaded: getCampaignsIsLoaded(state),
});

const mapDispatchToProps = { load: campaignsLoadRequest };

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getLoadArgs: pickMemoProps,
  getMemoProps: R.compose(R.values, pickMemoProps),
  getRenderProps: pickRenderProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemoLoader);
