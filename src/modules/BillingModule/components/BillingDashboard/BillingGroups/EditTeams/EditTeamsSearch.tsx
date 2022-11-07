import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { SearchField } from '@alycecom/ui';

import { getSearch, setSearchText } from '../../../../store/editTeams';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';

export interface EditTemasSearchProps {
  currentGroupId: string | null;
}

const EditTeamsSearch = ({ currentGroupId }: EditTemasSearchProps) => {
  const dispatch = useDispatch();
  const isMountRef = useRef(false);
  const search = useSelector(getSearch);
  const trackEvent = useBillingTrackEvent();
  const [searchText, setSearch] = useState(search);

  const handleChangeSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    [],
  );

  useDebounce(
    () => {
      if (isMountRef.current) {
        dispatch(setSearchText({ groupId: currentGroupId, searchText }));
        trackEvent(`Manage billing - Biling groups - Edit teams - Searching ${searchText}`);
      }
      isMountRef.current = true;
    },
    300,
    [dispatch, searchText, currentGroupId],
  );

  useEffect(() => {
    setSearch(search);
  }, [search]);

  return (
    <SearchField
      placeholder="Search teams"
      fullWidth
      value={searchText}
      onChange={handleChangeSearch}
      dataTestId="BillingGroups.EditTeam.SearchInput"
    />
  );
};

export default memo(EditTeamsSearch);
