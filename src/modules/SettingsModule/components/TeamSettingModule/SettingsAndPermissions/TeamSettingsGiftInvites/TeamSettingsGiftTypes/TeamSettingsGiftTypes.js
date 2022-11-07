import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { getMarketplaceRestrictionsTypes } from '../../../../../store/teams/giftInvites/marketplaceRestrictions/marketplaceRestrictions.selectors';
import {
  teamSettingsGiftInvitesTypesRequest,
  teamSettingsGiftInvitesUpdateTypesRequest,
} from '../../../../../store/teams/giftInvites/marketplaceRestrictions/marketplaceRestrictions.actions';
import TeamGiftTypeRestrictionsTable from '../TeamGiftTypeRestrictionsTable/TeamGiftTypeRestrictionsTable';

const TeamSettingsGiftTypes = ({ teamId }) => {
  const dispatch = useDispatch();
  const { types, availableProductsAmount, isLoading } = useSelector(getMarketplaceRestrictionsTypes);

  const [giftTypes, setGiftTypes] = useState([]);

  const onChange = useCallback(
    (id, value) => {
      setGiftTypes(giftTypes.map(type => (type.id === id ? { ...type, is_restricted: value } : type)));
    },
    [giftTypes],
  );

  const onCheckAll = useCallback(
    restrictionValue => {
      setGiftTypes(giftTypes.map(type => ({ ...type, is_restricted: restrictionValue })));
    },
    [giftTypes],
  );

  const handleSubmit = useCallback(() => {
    const ids = giftTypes.filter(type => type.is_restricted).map(type => type.id);
    dispatch(teamSettingsGiftInvitesUpdateTypesRequest({ teamId, ids }));
  }, [dispatch, giftTypes, teamId]);

  useEffect(() => {
    setGiftTypes(types);
  }, [types]);

  useEffect(() => {
    dispatch(teamSettingsGiftInvitesTypesRequest(teamId));
  }, [dispatch, teamId]);

  return (
    <>
      <TeamGiftTypeRestrictionsTable
        area="team"
        types={giftTypes}
        isLoading={isLoading}
        availableProductsCount={availableProductsAmount}
        selectedTypes={types.filter(item => !item.is_restricted).length}
        onChangeTypeRestricted={onChange}
        onCheckAll={onCheckAll}
        onSubmit={handleSubmit}
      />
    </>
  );
};

TeamSettingsGiftTypes.propTypes = {
  teamId: PropTypes.number.isRequired,
};

export default TeamSettingsGiftTypes;
