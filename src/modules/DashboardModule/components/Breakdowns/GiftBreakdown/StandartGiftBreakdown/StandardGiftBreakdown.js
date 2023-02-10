import React, { useCallback, useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { User } from '@alycecom/modules';
import { Checkbox } from '@mui/material';

import GiftBreakdownTable from '../GiftBreakdownTable/GiftBreakdownTable';
import { openSidebarTab } from '../../../../../../services/sidebar.service';
import {
  addGiftToTransferSelection,
  deleteGiftFromTransferSelection,
} from '../../../../store/breakdowns/giftTransfer/giftTransfer.actions';
import { useContactsAvatars } from '../../../../hooks/useContactsAvatars';
import { makeGetTeamById } from '../../../../../../store/teams/teams.selectors';
import {
  getGiftsFromTransferSelection,
  getGiftTransferSidebarState,
} from '../../../../store/breakdowns/giftTransfer/giftTransfer.selectors';
import GiftTransferSidebar from '../../GiftTransferSidebar/GiftTransferSidebar';
import { PaginationType } from '../GiftBreakdownTable/giftBreakdownTable.shape';

import GiftBreakdownToolbar from './GiftBreakdownToolbar';
import StandardGiftBreakdownRow from './StandardGiftBreakdownRow';

const standardBreakdownTableColumns = [
  {
    name: 'Contact Name',
    field: 'recipient_full_name',
  },
  {
    name: 'Company',
    field: 'recipient_company',
    getValue: data => data.company,
  },
  {
    name: 'Gift',
    field: 'product',
    getValue: data => data.gift,
  },
  {
    name: 'Campaign',
    field: 'campaign',
  },
  {
    name: 'Sent by(as)',
    field: 'sent_as',
    getValue: data => data.sentBy,
  },
  {
    name: 'Method',
    field: 'gift_invitation_type',
    getValue: data => data.method,
  },
  {
    name: 'Sent on',
    field: 'sent_on',
    getValue: data => data.sentOn && moment(data.sentOn).tz('US/Eastern').format('MMM DD, YYYY'),
  },
  {
    name: 'Gift status',
    field: 'status',
    getValue: data => data.giftStatus,
  },
];

const StandardGiftBreakdown = ({ teamId, campaignId, placeholder, breakdown, isLoading, pagination, memberId }) => {
  const dispatch = useDispatch();

  const team = useSelector(useMemo(() => makeGetTeamById(parseInt(teamId, 10)), [teamId]));
  const teamsIds = useSelector(User.selectors.getUserCanManageTeams);
  const isSidebarOpen = useSelector(getGiftTransferSidebarState);
  const selectedGifts = useSelector(getGiftsFromTransferSelection);
  const [getAvatarById, loadAvatars] = useContactsAvatars();

  const recipientsIds = useMemo(() => breakdown.map(recipient => recipient.recipientId), [breakdown]);
  const isUserTeamAdmin = useMemo(() => teamsIds && teamsIds.includes(teamId), [teamId, teamsIds]);
  const isEnterpriseModeEnabled = useMemo(() => team && team.settings.enterprise_mode_enabled, [team]);
  const displayCheckboxes = isUserTeamAdmin && isEnterpriseModeEnabled;

  const isAllChecked = useMemo(
    () =>
      breakdown.reduce((acc, data) => {
        const isChecked = !!selectedGifts.find(({ id }) => id === data.id);
        return acc && isChecked;
      }, true),
    [breakdown, selectedGifts],
  );

  const items = useMemo(
    () =>
      breakdown.map(data => {
        const isChecked = !!selectedGifts.find(({ id }) => id === data.id);
        return { id: data.id, isChecked, data };
      }),
    [breakdown, selectedGifts],
  );

  const onChangeGiftCheckbox = useCallback(
    (gift, action) => {
      if (action) {
        dispatch(addGiftToTransferSelection({ gift }));
      } else {
        dispatch(deleteGiftFromTransferSelection({ gift }));
      }
    },
    [dispatch],
  );

  const handleCheckAll = useCallback(
    e => {
      items.forEach(item => {
        onChangeGiftCheckbox(item.data, e.target.checked);
      });
    },
    [items, onChangeGiftCheckbox],
  );

  const columns = useMemo(
    () =>
      displayCheckboxes
        ? [
            {
              field: 'checkboxes',
              isSortDisabled: true,
              name: <Checkbox color="primary" checked={isAllChecked} onChange={handleCheckAll} />,
            },
            ...standardBreakdownTableColumns,
          ]
        : standardBreakdownTableColumns,
    [handleCheckAll, isAllChecked, displayCheckboxes],
  );

  useEffect(() => {
    loadAvatars(recipientsIds);
  }, [loadAvatars, recipientsIds]);

  const openGift = useCallback((gift, updateUrl) => {
    const giftInfo = { giftId: gift.id, contactId: gift.recipientId, giftStatusId: gift.giftStatusId };
    openSidebarTab(updateUrl, giftInfo);
  }, []);

  return (
    <>
      <GiftBreakdownTable
        breakdown={items}
        isLoading={isLoading}
        columns={columns}
        pagination={pagination}
        placeholder={placeholder}
        renderRow={({ item, columns: cols, updateUrl }) => (
          <StandardGiftBreakdownRow
            key={item.id}
            displayCheckbox={displayCheckboxes}
            teamId={teamId}
            item={item}
            columns={cols}
            isLoading={isLoading}
            updateUrl={updateUrl}
            getAvatarById={getAvatarById}
            openGift={openGift}
            onChangeGiftCheckbox={onChangeGiftCheckbox}
          />
        )}
        renderToolbar={({ placeholder: searchBarPlaceholder, search, handleSearch }) => (
          <GiftBreakdownToolbar
            placeholder={searchBarPlaceholder}
            search={search}
            onSearch={handleSearch}
            teamId={teamId}
            memberId={memberId}
            campaignId={campaignId}
          />
        )}
      />
      {isSidebarOpen && <GiftTransferSidebar teamId={teamId} campaignId={campaignId} />}
    </>
  );
};

StandardGiftBreakdown.propTypes = {
  teamId: PropTypes.number,
  campaignId: PropTypes.number,
  memberId: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  breakdown: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  pagination: PaginationType.isRequired,
  placeholder: PropTypes.string,
};

StandardGiftBreakdown.defaultProps = {
  teamId: undefined,
  campaignId: undefined,
  memberId: undefined,
  isLoading: false,
  placeholder: undefined,
};

export default memo(StandardGiftBreakdown);
