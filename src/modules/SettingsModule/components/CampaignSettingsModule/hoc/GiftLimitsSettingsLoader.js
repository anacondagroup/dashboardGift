import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadGiftLimitsRequest,
  setGiftLimits,
  toggleUserLimitSelection,
  toggleUsersLimitSelections,
  updateGiftLimitsRequest,
} from '../../../store/campaign/giftLimits/giftLimits.actions';
import { getGiftLimits, getIsLoading, getSelectedUsers } from '../../../store/campaign/giftLimits/giftLimits.selectors';
import { getUserLimitsIds } from '../../CampaignSettings/GiftInvitesSettings/GiftInvitesForms/GiftLimitsForm/giftLimits.helpers';

const GiftLimitsSettingsLoader = ({ campaignId, render }) => {
  const dispatch = useDispatch();

  const giftLimits = useSelector(getGiftLimits);
  const isLoading = useSelector(getIsLoading);
  const selectedUsers = useSelector(getSelectedUsers);

  useEffect(() => {
    dispatch(loadGiftLimitsRequest({ campaignId }));
  }, [campaignId, dispatch]);

  const onChange = useCallback(
    giftLimitData => {
      const selectedIds = getUserLimitsIds(giftLimitData);
      const updatedLimits = giftLimits.map(currentLimit => {
        if (selectedIds.includes(currentLimit.user_id)) {
          return giftLimitData.find(limit => limit.user_id === currentLimit.user_id);
        }
        return currentLimit;
      });
      dispatch(setGiftLimits(updatedLimits));
    },
    [dispatch, giftLimits],
  );

  const handleSelectLimit = useCallback(
    (userLimit, checked) => {
      dispatch(toggleUserLimitSelection({ userLimit, checked }));
    },
    [dispatch],
  );

  const handleSelectAll = useCallback(
    (usersLimits, checked) => {
      dispatch(toggleUsersLimitSelections({ usersLimits, checked }));
    },
    [dispatch],
  );

  const onSave = () => {
    dispatch(updateGiftLimitsRequest({ campaignId, giftLimits }));
    handleSelectAll(false);
  };
  return render({
    giftLimits,
    onChange,
    onSave,
    limitsIsLoading: isLoading,
    handleSelectLimit,
    handleSelectAll,
    selectedUsers,
  });
};

GiftLimitsSettingsLoader.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default GiftLimitsSettingsLoader;
