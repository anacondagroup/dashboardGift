import React, { memo, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { SearchField } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { TrackEvent } from '@alycecom/services';
import { useDebounce } from 'react-use';

import { setSearch } from '../../store/products/products.actions';
import { getSearch } from '../../store/products/products.selectors';
import { useGetSenderMarketplaceDefaultPayload } from '../../hooks/useTrackSenderMarketplace';

export interface IMarketplaceSearchProps {
  onChange: () => void;
}

const MarketplaceSearch = ({ onChange }: IMarketplaceSearchProps): ReactElement => {
  const isMount = useRef(false);
  const dispatch = useDispatch();
  const search = useSelector(getSearch);
  const [searchText, setSearchText] = useState(search);
  const [trackedText, setTrackedText] = useState(search);
  const { trackEvent } = TrackEvent.useTrackEvent();
  const eventPayload = useGetSenderMarketplaceDefaultPayload();

  useDebounce(
    () => {
      if (isMount.current) {
        dispatch(setSearch(searchText));
        onChange();
      }
      isMount.current = true;
    },
    300,
    [dispatch, onChange, searchText],
  );

  const handleChangeSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  useEffect(() => {
    if (search === trackedText) {
      return;
    }
    trackEvent('Sender Marketplace - Search submitted', {
      ...eventPayload,
      search,
    });
    setTrackedText(search);
  }, [eventPayload, search, trackEvent, trackedText]);

  return <SearchField placeholder="Search" value={searchText} onChange={handleChangeSearch} />;
};

export default memo(MarketplaceSearch);
