import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@mui/styles';
import { TableCell, TableRow, Checkbox, Grid, Avatar, Button, Typography, Box } from '@mui/material';
import { LinkButton, TableCellTooltip, TableLoadingLabel, DashboardIcon, DateFormat } from '@alycecom/ui';
import { CreateGift, Features } from '@alycecom/modules';
import { propertyByPath } from '@alycecom/utils';
import { TrackEvent, useGetCampaignByIdQuery } from '@alycecom/services';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useSelector } from 'react-redux';

import HoverPopover from '../../../../../../components/Shared/Popover/HoverPopover';
import { tabsKeys } from '../../../../../../constants/sidebarTabs.constants';
import { ColumnType } from '../GiftBreakdownTable/giftBreakdownTable.shape';

import GiftOptionsReadyButton from './GiftOptionsReadyButton';

const { giftStatuses } = CreateGift.constants;
const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: theme.spacing(1),
  },
  fakeAvatar: {
    backgroundColor: theme.palette.divider,
  },
  fakeAvatarIcon: {
    width: 'initial',
    color: theme.palette.common.white,
    fontSize: '1rem',
    height: '1rem',
  },
  viewGiftOptions: {
    boxShadow: 'none',
    fontSize: '14px',
  },
}));

const StandardGiftBreakdownRow = ({
  displayCheckbox,
  item,
  columns,
  isLoading,
  updateUrl,
  openGift,
  getAvatarById,
  onChangeGiftCheckbox,
}) => {
  const classes = useStyles();
  const columnsToRender = useMemo(() => columns.slice(displayCheckbox ? 2 : 1, columns.length - 1), [
    columns,
    displayCheckbox,
  ]);
  const getRenderValue = ({ field, getValue, formatValue = v => v }, itemData) => {
    const value = getValue ? getValue(itemData) : propertyByPath(field)(itemData);
    return value ? formatValue(value) : '-';
  };
  const { trackEvent } = TrackEvent.useTrackEvent();
  const { isChecked, data = {} } = item;
  const status = getRenderValue(columns[columns.length - 1], data);

  const onCheckboxChange = useCallback(e => onChangeGiftCheckbox(data, e.target.checked), [onChangeGiftCheckbox, data]);

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );
  const hasBudgetManagementLimit = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT),
  );
  const hasBudgetFeaturesEnabled = hasBudgetManagementSetup && hasBudgetManagementLimit;

  const handleContactClick = useCallback(() => {
    if (!data) {
      return;
    }

    const contactId = data.recipientId;
    if (data.giftStatusId !== giftStatuses.DISABLED) {
      const giftId = data.canChooseOptions ? data.id : undefined;
      updateUrl({ contactId, giftId, sidebarTab: tabsKeys.SEND_GIFT });
    } else {
      updateUrl({ contactId, sidebarTab: tabsKeys.PROFILE });
    }

    trackEvent('Enterprise dashboard — open gift from gift breakdown', {
      gift_id: data.id,
    });
  }, [data, trackEvent, updateUrl]);

  const handleStatusClick = useCallback(() => {
    openGift(data, updateUrl);
  }, [data, openGift, updateUrl]);

  const { data: campaign, isLoading: campaignQueryIsLoading } = useGetCampaignByIdQuery(data.campaignId || skipToken);

  const shouldShowGiftOptionsReady =
    !isLoading &&
    data.canChooseOptions &&
    data.giftStatusId === giftStatuses.PRODUCTS_PROPOSED &&
    (campaign || hasBudgetFeaturesEnabled) &&
    !campaignQueryIsLoading;

  return (
    <TableRow>
      {displayCheckbox && (
        <TableCell
          key="checkboxes"
          data-testid="Dashboard-GiftBreakDownTable-SelectCampaignCheckbox"
          data-recipientid={data.recipientId}
          component="th"
          scope="row"
        >
          {data.campaignId ? (
            <Checkbox color="primary" checked={isChecked} onChange={onCheckboxChange} />
          ) : (
            <HoverPopover hint="You can't move this gift as it doesn't belong to any campaign">
              <Checkbox color="primary" checked={isChecked} onChange={onCheckboxChange} disabled={!data.campaignId} />
            </HoverPopover>
          )}
        </TableCell>
      )}
      <TableCell key="avatar" component="th" scope="row">
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap">
          {isLoading || !getAvatarById(data.recipientId) ? (
            <Avatar alt={data.fullName} className={classNames(classes.avatar, classes.fakeAvatar)}>
              <DashboardIcon icon="user" className={classes.fakeAvatarIcon} />
            </Avatar>
          ) : (
            <Avatar alt={data.fullName} src={getAvatarById(data.recipientId)} className={classes.avatar} />
          )}
          <TableLoadingLabel
            maxWidth={400}
            pr={2}
            isLoading={isLoading}
            render={() => (
              <TableCellTooltip
                renderLabel={() => <LinkButton onClick={handleContactClick}>{data.fullName}</LinkButton>}
                title={data.fullName}
              />
            )}
          />
        </Grid>
      </TableCell>
      {columnsToRender.map(column => (
        <TableCell key={column.field}>
          <TableLoadingLabel
            pr={2}
            maxWidth={190}
            isLoading={isLoading}
            render={() => <TableCellTooltip title={getRenderValue(column, data)} />}
          />
        </TableCell>
      ))}
      <TableCell key="status">
        {isLoading && (
          <TableLoadingLabel
            pr={2}
            maxWidth={190}
            isLoading={isLoading}
            render={() => <TableCellTooltip title={status} />}
          />
        )}
        {!isLoading && !data.canChooseOptions && (
          <TableLoadingLabel
            pr={2}
            maxWidth={190}
            isLoading={isLoading}
            render={() => <TableCellTooltip title={status} />}
          />
        )}
        {!isLoading && data.giftStatusId === giftStatuses.DISABLED && (
          <TableLoadingLabel
            pr={2}
            maxWidth={190}
            isLoading={isLoading}
            render={() => <TableCellTooltip title={status} />}
          />
        )}
        {shouldShowGiftOptionsReady && (
          <GiftOptionsReadyButton campaign={campaign} giftStatus={data.giftStatus} onStatusClick={handleStatusClick} />
        )}
        {!isLoading && data.giftStatusId === giftStatuses.NEED_MORE_INFO && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.viewGiftOptions}
            onClick={handleStatusClick}
          >
            Need more info
          </Button>
        )}
        {!isLoading && data.giftStatusId === giftStatuses.SCHEDULED && (
          <>
            <Box>Gift scheduled</Box>
            <Box color="grey.main" fontSize="0.875rem">
              Sending on{' '}
              {data.scheduledAt && <DateFormat value={data.scheduledAt} timezone="US/Eastern" format="MM/DD/YY" />}
            </Box>
          </>
        )}
        {!isLoading &&
          data.canChooseOptions &&
          data.giftStatusId !== giftStatuses.SCHEDULED &&
          data.giftStatusId !== giftStatuses.PRODUCTS_PROPOSED &&
          data.giftStatusId !== giftStatuses.NEED_MORE_INFO &&
          data.giftStatusId !== giftStatuses.DISABLED && (
            <Typography className="Body-Regular-Left-Link-Bold Text-Pointer" onClick={handleStatusClick}>
              {status}
            </Typography>
          )}
      </TableCell>
    </TableRow>
  );
};

StandardGiftBreakdownRow.propTypes = {
  displayCheckbox: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isChecked: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object,
  }).isRequired,
  isLoading: PropTypes.bool,
  columns: PropTypes.arrayOf(ColumnType).isRequired,
  getAvatarById: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
  openGift: PropTypes.func.isRequired,
  onChangeGiftCheckbox: PropTypes.func.isRequired,
};

StandardGiftBreakdownRow.defaultProps = {
  displayCheckbox: false,
  isLoading: false,
};

export default StandardGiftBreakdownRow;
