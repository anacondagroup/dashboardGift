import React, { useCallback, useMemo, useReducer } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableSortLabel,
  TableCell,
  TableRow,
  TableBody,
  MenuItem,
  TableFooter,
  TablePagination,
  Checkbox,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ActionButton,
  NumberField,
  SelectFilter,
  SearchField,
  HtmlTip,
  Button,
  Tooltip,
  ModalConfirmationMessage,
} from '@alycecom/ui';
import { underscoreCase } from '@alycecom/utils';
import { TrackEvent } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { Auth } from '@alycecom/modules';

import UserTableInfo from '../../../../../../../components/Shared/UserTableInfo';
import { usePagination } from '../../../../../../../hooks/usePagination';
import { giftLimitsShape } from '../../../../../store/campaign/giftLimits/giftLimits.types';

import { getIsUserLimitSelected } from './giftLimits.helpers';
import { giftLimitsForm, giftLimitsFormInitialState } from './store/giftLimitsForm.reducer';
import {
  setBulkGiftLimit,
  setBulkPeriod,
  setIsBulkUpdateDisplay,
  setPage,
  setSearch,
  setSort,
} from './store/giftLimitsForm.actions';

const useStyles = makeStyles(({ spacing, palette }) => ({
  tableCell: {
    padding: spacing(0, 2),
  },
  noBorderBottom: {
    borderBottom: 'none',
  },
  button: {
    color: palette.link.main,
    border: `1px solid ${palette.divider}`,
    backgroundColor: palette.common.white,
    boxShadow: 'none',
    width: 210,
    height: 48,
    marginLeft: spacing(3),
  },
  submitButtonModal: {
    backgroundColor: palette.green.dark,
  },
  rootModal: {
    width: 530,
  },
}));

const transformUser = user => ({
  full_name: user.user_full_name,
  email: user.user_email,
  image: user.user_avatar,
});

const itemsPerPage = 10;

const GiftLimitsForm = ({
  isLoading,
  giftLimits,
  onSave,
  onChange,
  onSelectUserLimit,
  onSelectAll,
  selectedUsers,
  campaignId,
}) => {
  const classes = useStyles();

  const [state, formDispatch] = useReducer(giftLimitsForm, giftLimitsFormInitialState);

  const { page, sort, search, isBulkUpdateDisplay, bulkGiftLimit, bulkPeriod } = state;

  const { trackEvent } = TrackEvent.useTrackEvent();
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);

  const processedItems = useMemo(
    () =>
      R.compose(
        R.sort(sort.order === 'asc' ? R.ascend(R.prop(sort.column)) : R.descend(R.prop(sort.column))),
        R.filter(limit =>
          `${limit.user_full_name}${limit.user_email}`.toLowerCase().includes(search.toLocaleLowerCase()),
        ),
      )(giftLimits),
    [sort, search, giftLimits],
  );

  const isBulkActionDisabled = selectedUsers.length === 0 || isLoading;
  const isDisplayIndeterminate = selectedUsers.length > 0 && selectedUsers.length < processedItems.length;
  const isDisplayAllChecked = selectedUsers.length > 0 && selectedUsers.length === processedItems.length;

  const [items, showPagination, emptyRows, showEmptyRows] = usePagination(
    page,
    itemsPerPage,
    processedItems,
    isLoading,
  );

  const handleSelectMemberLimit = useCallback(
    (userLimit, checked) => {
      onSelectUserLimit(userLimit, checked);
    },
    [onSelectUserLimit],
  );

  const handleSelectAll = useCallback(
    checked => {
      onSelectAll(processedItems, checked);
    },
    [onSelectAll, processedItems],
  );

  const handleSubmitBulkUpdate = useCallback(() => {
    const updatedLimitData = selectedUsers.map(user => ({
      ...user,
      default_gift_limits_amount: bulkGiftLimit,
      period: bulkPeriod,
    }));
    onChange(updatedLimitData);
    trackEvent('Gift invites edit popup — clicked updated', {
      adminId,
      selectedUsersCount: selectedUsers.length,
      campaignId,
    });
    formDispatch(setIsBulkUpdateDisplay({ isBulkUpdateDisplay: false }));
  }, [formDispatch, bulkGiftLimit, bulkPeriod, selectedUsers, onChange, campaignId, trackEvent, adminId]);

  const handleCancelBulkUpdate = useCallback(() => {
    trackEvent('Gift invites edit popup — clicked cancelled', {
      adminId,
      selectedUsersCount: selectedUsers.length,
      campaignId,
    });
    formDispatch(setIsBulkUpdateDisplay({ isBulkUpdateDisplay: false }));
  }, [trackEvent, formDispatch, campaignId, selectedUsers, adminId]);

  const handleBulkOpen = useCallback(() => {
    trackEvent('Gift invites edit — clicked', { adminId, selectedUsersCount: selectedUsers.length, campaignId });
    formDispatch(setIsBulkUpdateDisplay({ isBulkUpdateDisplay: true }));
  }, [trackEvent, formDispatch, campaignId, selectedUsers, adminId]);

  const handleSetPage = useCallback(
    newPage => {
      formDispatch(setPage({ page: newPage }));
    },
    [formDispatch],
  );

  const handleSort = useCallback(
    column => {
      formDispatch(setPage({ page: 0 }));
      formDispatch(
        setSort({
          column,
          order: sort.column === column && sort.order === 'desc' ? 'asc' : 'desc',
        }),
      );
    },
    [sort, formDispatch],
  );

  const handleSearch = useCallback(
    e => {
      formDispatch(setSearch({ search: e.target.value }));
      handleSelectAll(false);
    },
    [formDispatch, handleSelectAll],
  );

  const handleBulkGiftLimit = useCallback(
    value => {
      formDispatch(setBulkGiftLimit({ bulkGiftLimit: value }));
    },
    [formDispatch],
  );

  const handleBulkPeriod = useCallback(
    value => {
      formDispatch(setBulkPeriod({ bulkPeriod: value }));
    },
    [formDispatch],
  );

  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  return (
    <>
      <Box>
        <Box mb={2} display="flex">
          <SearchField fullWidth placeholder="Search team members" value={search} onChange={handleSearch} />
          <Tooltip title="Please select user first" placement="top" arrow disableHoverListener={!isBulkActionDisabled}>
            <Button
              variant="contained"
              color="default"
              ml={4}
              disabled={isBulkActionDisabled}
              onClick={handleBulkOpen}
              data-testid="GiftLimits.BulkAdd.Btn"
              className={classes.button}
            >
              Bulk-edit invites
            </Button>
          </Tooltip>
        </Box>
        <Table padding="none">
          <TableHead>
            <TableRow>
              {processedItems.length !== 0 && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={isDisplayIndeterminate}
                    checked={isDisplayAllChecked}
                    onChange={event => handleSelectAll(event.target.checked)}
                  />
                </TableCell>
              )}
              <TableCell className={classes.tableCell} style={{ width: 300 }}>
                {selectedUsers.length > 0 ? (
                  <>
                    {selectedUsers.length} selected user{selectedUsers.length === 1 ? '' : 's'}
                  </>
                ) : (
                  <TableSortLabel
                    direction={sort.order}
                    active={sort.column === 'user_full_name'}
                    onClick={() => handleSort('user_full_name')}
                  >
                    Name
                  </TableSortLabel>
                )}
              </TableCell>
              <TableCell className={classes.tableCell} style={{ width: 200 }}>
                <TableSortLabel
                  direction={sort.order}
                  active={sort.column === 'default_gift_limits_amount'}
                  onClick={() => handleSort('default_gift_limits_amount')}
                >
                  Gift invites
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableCell} style={{ width: 250 }}>
                <TableSortLabel
                  direction={sort.order}
                  active={sort.column === 'period'}
                  onClick={() => handleSort('period')}
                >
                  Reset rate
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableCell} style={{ width: 150 }} align="right">
                <TableSortLabel
                  direction={sort.order}
                  active={sort.column === 'remaining_gift_limits_amount'}
                  onClick={() => handleSort('remaining_gift_limits_amount')}
                >
                  Remaining
                </TableSortLabel>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(limit => (
              <TableRow key={limit.user_id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={getIsUserLimitSelected(selectedUsers, limit)}
                    data-testid={`GiftLimits.Table.${limit.user_id}.Checkbox`}
                    onChange={event => handleSelectMemberLimit(limit, event.target.checked)}
                  />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <UserTableInfo user={transformUser(limit)} />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <NumberField
                      value={limit.default_gift_limits_amount}
                      data-testid={`${limit && limit.user && underscoreCase(limit.user.user_full_name)}_limit_amount`}
                      name="limit_amount"
                      onChange={value => {
                        onChange([{ ...limit, default_gift_limits_amount: value }]);
                      }}
                      onBlur={() => {
                        if (limit.default_gift_limits_amount < 1)
                          onChange([{ ...limit, default_gift_limits_amount: 0 }]);
                      }}
                    />
                    <Box ml={1}>
                      <Typography className="Body-Regular-Left-Inactive">that</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <SelectFilter
                    fullWidth
                    label=""
                    margin="normal"
                    onFilterChange={e => {
                      onChange([{ ...limit, period: e.period }]);
                    }}
                    renderItems={() => [
                      <MenuItem value="week">Resets weekly</MenuItem>,
                      <MenuItem value="month">Resets monthly</MenuItem>,
                      <MenuItem value="quarter">Resets quarterly</MenuItem>,
                      <MenuItem value="infinite">Does not reset</MenuItem>,
                    ]}
                    name="period"
                    value={limit.period}
                  />
                </TableCell>
                <TableCell className={classes.tableCell} align="right">
                  {limit.remaining_gift_limits_amount}
                </TableCell>
                <TableCell />
              </TableRow>
            ))}
            {showEmptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
          {showPagination && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  className={classes.noBorderBottom}
                  rowsPerPageOptions={[itemsPerPage]}
                  colSpan={5}
                  count={processedItems.length}
                  rowsPerPage={itemsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  onPageChange={(event, nextPage) => handleSetPage(nextPage)}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Box>
      <Box mt={2} mb={2}>
        <HtmlTip>
          Tip: Gift limits that are set to ‘Resets weekly’ will be reset on the Monday of following week. Gift limits
          that are set to ‘Resets monthly’ will reset on the first calendar day of the following month. Gift limits that
          are set to ‘Resets quarterly‘ will reset on the first calendar day of the new quarter. Gift limits that are
          set to ‘Does not reset‘ will not reset until reset rate changes again.
        </HtmlTip>
      </Box>
      <Box width={1} display="flex" justifyContent="space-between">
        <ActionButton width={100} data-testid="gift_limits_save" onClick={handleSave} disabled={isLoading}>
          Save
        </ActionButton>
      </Box>
      <ModalConfirmationMessage
        title="How many invites do you want allocate to your team members"
        icon="gift"
        variant="warning"
        submitButtonText="Update"
        cancelButtonText="Cancel"
        isOpen={isBulkUpdateDisplay}
        width="100%"
        onSubmit={handleSubmitBulkUpdate}
        onDiscard={handleCancelBulkUpdate}
        customClasses={{ submitButton: classes.submitButtonModal, root: classes.rootModal }}
      >
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
          <Box width={150}>
            <Typography>Total Invites</Typography>
            <NumberField name="limit_amount" value={bulkGiftLimit} onChange={value => handleBulkGiftLimit(value)} />
          </Box>
          <Box ml={2} mr={2} mt={3}>
            <Typography className="Body-Regular-Left-Inactive">that</Typography>
          </Box>
          <Box width={200}>
            <Typography>Reset Rate</Typography>
            <SelectFilter
              fullWidth
              renderItems={() => [
                <MenuItem value="week">Resets weekly</MenuItem>,
                <MenuItem value="month">Resets monthly</MenuItem>,
                <MenuItem value="quarter">Resets quarterly</MenuItem>,
                <MenuItem value="infinite">Does not reset</MenuItem>,
              ]}
              name="period"
              value={bulkPeriod}
              onFilterChange={e => handleBulkPeriod(e.period)}
            />
          </Box>
        </Box>
      </ModalConfirmationMessage>
    </>
  );
};

GiftLimitsForm.propTypes = {
  giftLimits: PropTypes.arrayOf(giftLimitsShape).isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onSelectUserLimit: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(giftLimitsShape).isRequired,
  campaignId: PropTypes.number.isRequired,
};

GiftLimitsForm.defaultProps = {
  isLoading: false,
};

export default GiftLimitsForm;
