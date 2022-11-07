import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { useUrlQuery } from '@alycecom/hooks';

import {
  getGiftBreakdown,
  getGiftIsLoading,
  getGiftPagination,
  getGiftReportIsLoading,
} from '../store/breakdowns/gift/gift.selectors';
import {
  giftBreakDownClear,
  giftBreakdownDownloadReportRequest,
  giftBreakdownRequest,
} from '../store/breakdowns/gift/gift.actions';

const useGiftBreakdown = ({ campaignId, teamId, memberId } = {}) => {
  const dispatch = useDispatch();

  const {
    dateRangeFrom,
    dateRangeTo,
    giftSort: sort,
    giftDirection: sortDirection,
    giftSearch: search,
    giftPage: page,
  } = useUrlQuery(['dateRangeFrom', 'dateRangeTo', 'giftSort', 'giftDirection', 'giftSearch', 'giftPage']);

  const isLoading = useSelector(getGiftIsLoading);
  const pagination = useSelector(getGiftPagination);
  const breakdown = useSelector(getGiftBreakdown);
  const isGiftReportLoading = useSelector(getGiftReportIsLoading);

  const breakdownRequestProps = useMemo(
    () => ({
      teamId,
      campaignId,
      memberId,
      dateRangeFrom,
      dateRangeTo,
      sort,
      sortDirection,
      search,
      page,
      per_page: 10,
    }),
    [teamId, campaignId, memberId, dateRangeFrom, dateRangeTo, sort, sortDirection, search, page],
  );

  const giftReportRequestProps = useMemo(
    () => ({
      teamId,
      campaignId,
      memberId,
      dateRangeFrom,
      dateRangeTo,
      sort,
      sortDirection,
      search,
    }),
    [teamId, campaignId, memberId, dateRangeFrom, dateRangeTo, sort, sortDirection, search],
  );

  const downloadReport = useCallback(() => dispatch(giftBreakdownDownloadReportRequest(giftReportRequestProps)), [
    dispatch,
    giftReportRequestProps,
  ]);

  useEffect(() => {
    dispatch(giftBreakdownRequest(breakdownRequestProps));
    return () => {
      dispatch(giftBreakDownClear());
    };
  }, [dispatch, breakdownRequestProps]);

  return {
    isLoading,
    breakdown,
    pagination,
    isGiftReportLoading,
    downloadReport,
  };
};

export default useGiftBreakdown;
