import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, screen, userEvent, waitFor } from '../../../../../../testUtils';
import BillingGroupsSearch from './BillingGroupsSearch';
import {
  IBillingGroupsState,
  initialState as billingGroupsInitialState,
} from '../../../../store/billingGroups/billingGroups.reducer';
import { setSearchGroupTerm } from '../../../../store/billingGroups/billingGroups.actions';

describe('BillingGroupsSearch', () => {
  const setup = (billingGroupsState: IBillingGroupsState) =>
    render(<BillingGroupsSearch />, {
      initialState: { billing: { billingGroups: { ...billingGroupsState } } },
    });

  test('Search field should be rendered', () => {
    setup({ ...billingGroupsInitialState, searchGroupTerm: 'ThisIsASearchTerm' });
    expect(screen.queryByTestId('BillingGroups.SearchInput')).toBeInTheDocument();
  });

  test('Searching function after typing', () => {
    setup({ ...billingGroupsInitialState, searchGroupTerm: '' });
    const searchField = screen.getByTestId('BillingGroups.SearchInput');
    const typedString = 'p';

    fireEvent.change(searchField, { target: { value: typedString } });
    expect(screen.queryByTestId('BillingGroups.SearchInput')).toHaveValue(typedString);
  });

  test('Should update search group term on type', async () => {
    const { dispatch } = setup({ ...billingGroupsInitialState });
    const searchField = screen.getByTestId('BillingGroups.SearchInput');
    const typedString = 'p';

    userEvent.type(searchField, typedString);

    await waitFor(() => {
      expect(dispatch).toBeCalledWith(setSearchGroupTerm({ searchGroupTerm: typedString, isSearching: true }));
    });
  });
});
