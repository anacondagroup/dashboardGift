import * as R from 'ramda';
import { connect } from 'react-redux';

import {
  getContactsBreakdown,
  getContactsIsLoading,
  contactsApiParams,
  getContactsIsLoaded,
} from '../../store/breakdowns/contacts/contacts.selectors';
import { contactsLoadRequest } from '../../store/breakdowns/contacts/contacts.actions';
import MemoLoader from '../../../../hoc/MemoLoader/MemoLoader';
import { getStateUpdatedTimeState } from '../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';

const pickMemoProps = props => ({ ...contactsApiParams(props), ...R.pick(['forceUpdate'], props) });

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
]);

const mapStateToProps = state => ({
  isLoading: getContactsIsLoading(state),
  breakdown: getContactsBreakdown(state),
  forceUpdate: getStateUpdatedTimeState(state),
  isLoaded: getContactsIsLoaded(state),
});

const mapDispatchToProps = { load: contactsLoadRequest };

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  getLoadArgs: pickMemoProps,
  getMemoProps: R.compose(R.values, pickMemoProps),
  getRenderProps: pickRenderProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MemoLoader);
