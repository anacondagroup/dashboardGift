import React, { memo, useCallback, useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';

import DashboardSection from '../../../../../components/Dashboard/Shared/DashboardSection';
import { getCampaignsBreakdown } from '../../../store/breakdowns/campaigns/campaigns.selectors';
import {
  getGiftBatchesPagination,
  getGiftBatchesSort,
  setGiftBatchesPagination,
  setGiftBatchesSearch,
  setGiftBatchesSort,
  setTeamsCampaignsIds,
} from '../../../store/breakdowns/giftBatches';
import GiftBatchesBreakdownTable from '../../Breakdowns/GiftBatchesBreakdown/GiftBatchesBreakdownTable';
import GiftBatchesBreakdownToolbar from '../../Breakdowns/GiftBatchesBreakdown/GiftBatchesBreakdownToolbar';
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import { TABLE_SORT } from '../../../../../components/Shared/CustomTable/customTable.constants';

export interface IGiftsBatchesSectionProps {
  title: string;
  teamId: string;
  subtitle: string;
  placeholder: string;
  memberId: number | string;
  campaignId?: number;
}

type TCampaignInfo = {
  giftsAccepted: string;
  giftsSent: number;
  giftsViewed: string;
  id: number;
  meetingsBooked: string;
  name: string;
  teamId: number;
  campaignId?: number[];
  type: string;
};

const GiftBatchesSection = ({
  title = 'Bulk Gifts in Progress',
  subtitle,
  teamId,
  campaignId,
}: IGiftsBatchesSectionProps) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>('');

  const campaignList = useSelector(getCampaignsBreakdown);
  const sort = useSelector(getGiftBatchesSort);
  const pagination = useSelector(getGiftBatchesPagination);

  const handleChangeSort = useCallback(
    newColumn => {
      dispatch(
        setGiftBatchesSort({
          column: newColumn,
          direction: sort.column === newColumn && sort.direction === TABLE_SORT.ASC ? TABLE_SORT.DESC : TABLE_SORT.ASC,
        }),
      );
    },
    [dispatch, sort.column, sort.direction],
  );

  const handleChangeSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch],
  );

  const handlePageChange = useCallback(
    (_: unknown, page: number) => {
      dispatch(setGiftBatchesPagination(page));
    },
    [dispatch],
  );

  useDebounce(() => dispatch(setGiftBatchesSearch(search)), 300, [dispatch, search]);

  useEffect(() => {
    const campaignsIdsList = campaignId
      ? [campaignId]
      : campaignList
          .filter((campaignInfo: TCampaignInfo) => campaignInfo.type === CAMPAIGN_TYPES.PROSPECTING)
          .map((campaignInfo: TCampaignInfo) => campaignInfo.id);

    dispatch(
      setTeamsCampaignsIds({
        teamIds: [teamId],
        campaignIds: campaignsIdsList,
      }),
    );
  }, [teamId, campaignId, campaignList, dispatch]);

  return (
    <>
      <DashboardSection
        title={title}
        subtitle={subtitle}
        icon="gift"
        showDownloadReport={false}
        isReportLoading={false}
        onDownloadReport={() => {}}
      >
        <GiftBatchesBreakdownTable
          sort={sort}
          onChangeSort={handleChangeSort}
          pagination={pagination}
          onPageChange={handlePageChange}
        >
          <GiftBatchesBreakdownToolbar
            placeholder="Search Alyce: Company Team Gifts"
            search={search}
            onSearch={handleChangeSearch}
          />
        </GiftBatchesBreakdownTable>
      </DashboardSection>
    </>
  );
};

export default memo(GiftBatchesSection);
