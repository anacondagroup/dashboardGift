import React, { memo, useCallback } from 'react';
import {
  AutoSizer,
  Column,
  Index,
  InfiniteLoader,
  SortDirection,
  SortDirectionType,
  TableCellProps,
  TableHeaderProps,
  WindowScroller,
} from 'react-virtualized';
import { AlyceTheme, Button, Icon, VirtualizedTable } from '@alycecom/ui';
import { Avatar, Box, InputAdornment, TextField, Typography, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { MessageType, showGlobalMessage } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import moment from 'moment';

import { IntegrationType, TGiftLinkSortFilter } from '../../../store/entities/giftLinks/giftLinks.types';
import { setSortFilter } from '../../../store/entities/giftLinks/giftLinks.actions';
import {
  getGiftLinkIds,
  getGiftLinksMap,
  getGiftLinksTotalWithLoading,
  getSortFilter,
} from '../../../store/entities/giftLinks/giftLinks.selectors';
import { getRemindersMap } from '../../../store/integrationReminders/integrationReminders.selectors';
import { REMIND_INTERVAL } from '../../../store/integrationReminders/integrationReminders.constants';
import { sendReminder } from '../../../store/integrationReminders/integrationReminders.actions';
import { useActivate } from '../../../hooks/useActivate';
import { useTrackCampaignBuilderCopyButtonClicked } from '../../../hooks/useTrackActivate';

import GoogleIcon from './icons/google.svg';
import MicrosoftIcon from './icons/microsoft.svg';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  table: {
    '& .ReactVirtualized__Table__row': {
      borderBottom: `1px solid ${palette.divider}`,
    },
    '& .ReactVirtualized__Table__rowColumn': {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    '& .ReactVirtualized__Table__headerColumn': {
      display: 'flex',
    },
  },
  copyBtn: {
    minWidth: 'auto',
    color: palette.text.primary,
  },
  integrationIcon: {
    width: 31,
  },
  helperText: {
    fontSize: '0.875rem',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing(1 / 2),
  },
  helperBtn: {
    flex: '0 0 auto',
    padding: 0,
    fontStyle: 'italic',
  },
  helperNote: {
    fontStyle: 'italic',
    color: '#58ac6e',
  },
}));

export interface IGiftLinksTableProps {
  onLoadMore: () => void;
  displayLinks?: boolean;
}

const GiftLinksTable = ({ onLoadMore, displayLinks = true }: IGiftLinksTableProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { campaignId } = useActivate();
  const giftLinkIds = useSelector(getGiftLinkIds);
  const giftLinksMap = useSelector(getGiftLinksMap);
  const rowCount = useSelector(getGiftLinksTotalWithLoading);
  const sortFilter = useSelector(getSortFilter);
  const remindersMap = useSelector(getRemindersMap);
  const [, copy] = useCopyToClipboard();
  const trackCopyLinkButtonClicked = useTrackCampaignBuilderCopyButtonClicked();

  const getRowItem = ({ index }: Index) => giftLinksMap[giftLinkIds[index]] || {};
  const getIsRowLoaded = (index: Index) => typeof getRowItem(index).userId !== 'undefined';

  const loadMoreRows = useCallback(() => {
    onLoadMore();
    return Promise.resolve();
  }, [onLoadMore]);

  const handleSort = useCallback(
    ({ sortBy, sortDirection }: { sortBy: string; sortDirection: SortDirectionType }) => {
      dispatch(
        setSortFilter({
          field: sortBy as TGiftLinkSortFilter['field'],
          direction: sortDirection.toLowerCase() as TGiftLinkSortFilter['direction'],
        }),
      );
    },
    [dispatch],
  );

  const renderColumnName = ({ rowData, rowIndex }: TableCellProps) => {
    const isRowLoaded = getIsRowLoaded({ index: rowIndex });

    return (
      <Box display="flex" alignItems="center" width={1}>
        <Box flex="0 0 30px">
          {isRowLoaded ? <Avatar src={rowData.imageUrl} /> : <Skeleton variant="circular" width={30} height={30} />}
        </Box>
        <Box display="flex" flexDirection="column" width={1} pl={1}>
          <div>{isRowLoaded ? `${rowData.firstName} ${rowData.lastName}` : <Skeleton width="100%" />}</div>
          <Typography variant="caption">{isRowLoaded ? rowData.email : <Skeleton width="55%" />}</Typography>
        </Box>
      </Box>
    );
  };

  const renderCalendarColumn = ({ rowIndex, cellData }: TableCellProps) => {
    if (getIsRowLoaded({ index: rowIndex })) {
      switch (cellData) {
        case IntegrationType.Google: {
          return <img alt="google" src={GoogleIcon} className={classes.integrationIcon} />;
        }
        case IntegrationType.Microsoft: {
          return <img alt="microsoft" src={MicrosoftIcon} className={classes.integrationIcon} />;
        }
        default: {
          return <Icon color="grey.main" fontSize={2.25} icon="calendar-times" />;
        }
      }
    }

    return <></>;
  };

  const renderLinkColumn = ({ rowIndex, cellData, rowData }: TableCellProps) => {
    const isRowLoaded = getIsRowLoaded({ index: rowIndex });
    const showSendReminder =
      !rowData.integrationType &&
      (!remindersMap[rowData.userId] || Date.now() - remindersMap[rowData.userId] >= REMIND_INTERVAL);
    const showReminderSent =
      !rowData.integrationType &&
      remindersMap[rowData.userId] &&
      Date.now() - remindersMap[rowData.userId] < REMIND_INTERVAL;
    if (isRowLoaded) {
      return (
        <Box width={1}>
          <TextField
            fullWidth
            variant="outlined"
            value={cellData}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => {
                      copy(cellData);
                      trackCopyLinkButtonClicked(campaignId as number);
                      dispatch(showGlobalMessage({ type: MessageType.Good, text: 'Copied!' }));
                    }}
                    className={classes.copyBtn}
                    size="small"
                    variant="text"
                  >
                    <Icon icon={['far', 'copy']} />
                  </Button>
                </InputAdornment>
              ),
              readOnly: true,
            }}
          />
          {showSendReminder && (
            <Box className={classes.helperText}>
              <Button
                className={classes.helperBtn}
                variant="text"
                size="small"
                onClick={() => {
                  if (campaignId) {
                    dispatch(sendReminder({ campaignId, userId: rowData.userId }));
                  }
                }}
              >
                Send Reminder
              </Button>
              &nbsp; to Connect their Calendar to Alyce
            </Box>
          )}
          {showReminderSent && (
            <Box className={classes.helperText}>
              <Box className={classes.helperNote}>Reminder sent</Box>
              &nbsp; {moment(remindersMap[rowData.userId]).fromNow()}
            </Box>
          )}
        </Box>
      );
    }

    return <Skeleton width="100%" height="100%" />;
  };

  const renderHeader = ({ label, dataKey, disableSort, sortBy, sortDirection }: TableHeaderProps) => {
    const isSorted = sortBy === dataKey;
    const isUp = sortDirection === SortDirection.ASC;

    const sortIcon = isUp ? (
      <Icon color="grey.timberWolfDark" icon="sort-up" />
    ) : (
      <Icon color="grey.timberWolfDark" icon="sort-down" />
    );

    return (
      <>
        {label}
        {!disableSort && <Box pl={0.5}>{isSorted ? sortIcon : <Icon color="grey.timberWolf" icon="sort" />}</Box>}
      </>
    );
  };

  const calcRowHeight = (index: Index) => {
    if (getIsRowLoaded(index) && !getRowItem(index).integrationType) {
      return 80;
    }

    return 57;
  };

  if (!campaignId) {
    return <></>;
  }

  return (
    <WindowScroller>
      {({ height, registerChild, scrollTop }) => (
        <div ref={el => registerChild(el)}>
          <InfiniteLoader
            isRowLoaded={getIsRowLoaded}
            loadMoreRows={loadMoreRows}
            minimumBatchSize={1}
            rowCount={rowCount}
          >
            {({ onRowsRendered }) => (
              <AutoSizer disableHeight disableWidth={!displayLinks} style={{ width: '100%' }}>
                {({ width }) => (
                  <VirtualizedTable
                    className={classes.table}
                    rowHeight={calcRowHeight}
                    onRowsRendered={onRowsRendered}
                    rowCount={rowCount}
                    width={displayLinks ? width : 480}
                    rowGetter={getRowItem}
                    sort={handleSort}
                    sortBy={sortFilter?.field}
                    sortDirection={sortFilter?.direction?.toUpperCase() as SortDirectionType}
                    disableShadows
                    maxVisibleRows={4}
                    height={height}
                    scrollTop={scrollTop}
                    autoHeight
                  >
                    <Column
                      headerRenderer={renderHeader}
                      width={displayLinks ? (width * 4) / 12 : 280}
                      label="Name"
                      dataKey="firstName"
                      cellRenderer={renderColumnName}
                    />
                    <Column
                      headerRenderer={renderHeader}
                      width={displayLinks ? (width * 2.5) / 12 : 200}
                      label="Calendar connected"
                      dataKey="integrationType"
                      cellRenderer={renderCalendarColumn}
                    />
                    {displayLinks && (
                      <Column
                        disableSort
                        width={(width * 5.5) / 12}
                        label="Gift link"
                        dataKey="giftLink"
                        cellRenderer={renderLinkColumn}
                      />
                    )}
                  </VirtualizedTable>
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      )}
    </WindowScroller>
  );
};

export default memo(GiftLinksTable);
