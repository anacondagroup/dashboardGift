import React, { ReactNode, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDebouncedSetState } from '@alycecom/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { CampaignSettings } from '@alycecom/modules';
import { pick } from 'ramda';
import { EntityId } from '@alycecom/utils';

import { SectionTitle } from '../styled/Styled';
import {
  GiftLimitsStepField,
  TBulkUpdateGiftLimitsForm,
  TBulkUpdateRemainingForm,
  TGiftLimitsFilters,
  TGiftLimitsForm,
  TUpdateGiftLimitsRequest,
  TUpdateProspectingCampaignMember,
  TUpdateRemainingGiftLimitsRequest,
} from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { getDetailsData } from '../../store/prospectingCampaign/steps/details/details.selectors';
import {
  getGiftLimitEntities,
  getGiftLimitsFilters,
  getIsGiftLimitsBulkFulfilled,
  getIsGiftLimitsFilteringPending,
  getIsGiftLimitsFulfilled,
  getIsGiftLimitsIdle,
  getIsGiftLimitsPending,
} from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';
import {
  giftLimitsFormDefaultValues,
  giftLimitsFormResolver,
} from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.schemas';
import {
  setGiftLimitsSearchFilter,
  setGiftLimitsSortFilter,
} from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.actions';

import GiftLimitsTableController from './controllers/GiftLimitsTableController/GiftLimitsTableController';
import { useTableRowCheckboxController } from './hooks/useTableRowCheckboxController';
import TableSearchToolbar from './components/TableSearch/TableSearchToolbar';

export interface IInvitesChildRendererProps {
  isDirty: boolean;
}

export interface IInvitesFormProps {
  children: ReactNode | ((arg0: IInvitesChildRendererProps) => ReactNode);
  onSubmit: (data: TUpdateGiftLimitsRequest, isDirty: boolean) => void;
  onFetchGiftLimits: () => void;
  onBulkEdit: (data: TUpdateGiftLimitsRequest) => void;
  onBulkUpdateRemaining?: (data: TUpdateRemainingGiftLimitsRequest) => void;
}

const styles = {
  searchToolbar: {
    my: 2.5,
  },
} as const;

const InvitesForm = ({
  children,
  onSubmit,
  onFetchGiftLimits,
  onBulkEdit,
  onBulkUpdateRemaining,
}: IInvitesFormProps): JSX.Element => {
  const dispatch = useDispatch();
  const { teamId } = useSelector(getDetailsData) || {};
  const isBulkFulfilled = useSelector(getIsGiftLimitsBulkFulfilled);
  const isFulfilled = useSelector(getIsGiftLimitsFulfilled);
  const isIdle = useSelector(getIsGiftLimitsIdle);
  const isPending = useSelector(getIsGiftLimitsPending);
  const isFilteringPending = useSelector(getIsGiftLimitsFilteringPending);
  const giftLimits = useSelector(getGiftLimitEntities);
  const { search } = useSelector(getGiftLimitsFilters);

  const { useIds: useTeamMembersIds, isFulfilled: isTeamMembersFulfilled } = CampaignSettings.hooks.useTeamMembers(
    teamId,
  );
  const teamMembersIds = useTeamMembersIds();

  const {
    setIsAllChecked,
    setIsIdxChecked,
    getIsIdxChecked,
    isAllChecked,
    isIndeterminate,
    checkedIdx,
  } = useTableRowCheckboxController<EntityId>(teamMembersIds);

  const {
    handleSubmit,
    formState: { isDirty, dirtyFields },
    control,
    reset,
    trigger,
  } = useForm({
    mode: 'all',
    resolver: giftLimitsFormResolver,
    defaultValues: giftLimitsFormDefaultValues,
    shouldUnregister: false,
  });
  const [debouncedSearch, setSearch, searchValue, isSearchReady] = useDebouncedSetState('', 500);

  const submitHandler = (data: TGiftLimitsForm) => {
    setSearch('');
    onSubmit(
      {
        ...data,
        giftLimits: Object.values(
          pick(Object.keys(dirtyFields?.giftLimits ?? {}), data.giftLimits),
        ) as TUpdateProspectingCampaignMember[],
      },
      isDirty,
    );
  };

  const handleSaveBulkEdit = useCallback(
    (data: TBulkUpdateGiftLimitsForm) => {
      onBulkEdit({
        giftLimits: checkedIdx.map(userId => ({
          userId,
          ...data,
        })),
      });
    },
    [checkedIdx, onBulkEdit],
  );

  const handleSaveBulkUpdateRemaining = useCallback(
    (data: TBulkUpdateRemainingForm) => {
      if (onBulkUpdateRemaining) {
        onBulkUpdateRemaining({
          userIds: checkedIdx,
          remaining: data.remaining as number,
        });
      }
    },
    [checkedIdx, onBulkUpdateRemaining],
  );

  const handleSort = useCallback(
    (sort: TGiftLimitsFilters['sort']) => {
      dispatch(setGiftLimitsSortFilter(sort));
    },
    [dispatch],
  );

  const isResetReady = isTeamMembersFulfilled && (isFulfilled || isBulkFulfilled);
  useEffect(() => {
    if (isResetReady) {
      reset({
        [GiftLimitsStepField.GiftLimits]: giftLimits,
      });
    }
  }, [giftLimits, isResetReady, reset]);

  useEffect(() => {
    if (isIdle) {
      onFetchGiftLimits();
    }
  }, [onFetchGiftLimits, isIdle]);

  useEffect(() => {
    if (isSearchReady && debouncedSearch !== search) {
      dispatch(setGiftLimitsSearchFilter(debouncedSearch));
    }
  }, [isSearchReady, debouncedSearch, search, dispatch]);

  return (
    <>
      <Box pb={10}>
        <SectionTitle>Messaging Invites</SectionTitle>
        <Box my={2}>
          <Box component="span" fontWeight={700}>
            Important note
          </Box>
          : your team members{' '}
          <Box component="span" fontWeight={700}>
            must
          </Box>{' '}
          have invitations allocated to them in order to send from this campaign.
        </Box>
        <TableSearchToolbar
          sx={styles.searchToolbar}
          actionsDisabled={checkedIdx.length === 0}
          search={searchValue}
          onSearchChange={setSearch}
          onBulkUpdate={handleSaveBulkEdit}
          onBulkSetRemaining={onBulkUpdateRemaining ? handleSaveBulkUpdateRemaining : undefined}
        />
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box>
            <GiftLimitsTableController
              control={control}
              trigger={trigger}
              isAllChecked={isIndeterminate ? null : isAllChecked}
              setIsAllChecked={setIsAllChecked}
              setIsUserIdChecked={setIsIdxChecked}
              getIsUserIdChecked={getIsIdxChecked}
              selectedCount={checkedIdx.length}
              onSetRemaining={onBulkUpdateRemaining}
              onSort={handleSort}
              loading={isPending || !isSearchReady || isFilteringPending}
            />
          </Box>
          {typeof children === 'function' ? children({ isDirty }) : children}
        </form>
      </Box>
    </>
  );
};

export default InvitesForm;
