import { SearchField } from '@alycecom/ui';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';

import { getSearchGroupTerm, setSearchGroupTerm } from '../../../../store/billingGroups';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';

const BillingGroupsSearch = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();
  const searchGroupTerm = useSelector(getSearchGroupTerm);
  const [searchTerm, setSearchTerm] = useState(searchGroupTerm);

  const handleChangeSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      trackEvent('Manage Billing - Billing Groups - Searching groups', { searchTerm: event.target.value });
    },
    [setSearchTerm, trackEvent],
  );

  useDebounce(() => dispatch(setSearchGroupTerm({ searchGroupTerm: searchTerm, isSearching: !!searchTerm })), 300, [
    dispatch,
    searchTerm,
  ]);

  useEffect(() => {
    setSearchTerm(searchGroupTerm);
  }, [searchGroupTerm]);
  return (
    <>
      <SearchField
        placeholder="Search Groups"
        dataTestId="BillingGroups.SearchInput"
        onChange={handleChangeSearch}
        value={searchTerm}
      />
    </>
  );
};

export default memo(BillingGroupsSearch);
