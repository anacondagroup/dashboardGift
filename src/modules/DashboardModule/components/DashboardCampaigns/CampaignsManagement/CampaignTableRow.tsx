import React, { memo, useCallback, useMemo, useState } from 'react';
import { Box, Checkbox, TableCell, TableRow, Typography, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { NavLink, useHistory } from 'react-router-dom';
import {
  ActionsMenu,
  AlyceTheme,
  Icon,
  IMenuItem,
  NumberFormat,
  TableCellTooltip,
  TableLoadingLabel,
} from '@alycecom/ui';
import { Features, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { IRowDataItem } from '../../../../../components/Shared/CustomTable/CustomTable.types';
import { ICampaignBreakdownListItem } from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';
import { giftBreakDownClear } from '../../../store/breakdowns/gift/gift.actions';
import { getCampaignTypeName } from '../../../../../helpers/campaignSettings.helpers';
import CampaignCountries from '../../../../SettingsModule/components/CampaignSettings/CampaignTables/CampaignCountries';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import {
  getActionAvailabilityOptions,
  getArchiveAvailabilityOptions,
  getUnArchiveAvailabilityOptions,
} from '../../../helpers/campaignsManagement.helpers';
import { ActivateCampaignRoutes, ActivateEditorStep } from '../../../../ActivateModule/routePaths';

import CampaignTypeLabel from './CampaignTypeLabel';
import CampaignStatusLabel from './CampaignStatusLabel';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, breakpoints }) => ({
  actionButton: {
    display: 'none',
    right: 0,
    color: palette.link.main,
    marginRight: spacing(1),
    fontSize: 14,
  },
  actionMenu: {
    border: `1px solid ${palette.primary.main}`,
    borderRadius: 5,
    marginTop: spacing(1 / 2),
    marginBottom: spacing(1 / 2),
    '& > li': {
      color: palette.primary.main,
      fontWeight: 400,
      paddingLeft: spacing(3),
      paddingRight: spacing(3),
      fontSize: 14,
    },
    '& > li.Mui-disabled': {
      pointerEvents: 'auto',
    },
  },
  visibleActionButton: {
    display: 'flex',
  },
  tableRow: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: palette.teal.lighten,
    },
  },
  rootItem: {
    maxWidth: '150px',
  },
  tableData: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  editor: {
    fontSize: 12,
    color: palette.primary.main,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  campaignType: {
    [breakpoints.down(breakpoints.values.xl)]: {
      maxWidth: 180,
      fontSize: 14,
    },
  },
}));

interface ICampaignTableRowProps<T extends IRowDataItem> {
  isLoading: boolean;
  rowItem: T;
  campaignLink: (id: number) => string;
  onOpenCampaignSettings: (data: T) => void;
  onDuplicateCampaign: (data: T) => void;
  onOpenArchiveCampaignModal: (data: T) => void;
  onOpenCampaignDetails: (data: T) => void;
  onUnArchiveCampaign: (data: T) => void;
  onSetCampaignExpired: (data: T) => void;
  onDiscardDraft: (data: T) => void;
  isSelected: boolean;
  onToggleSelect: (campaign: T, checked: boolean) => void;
}

const CampaignTableRow = ({
  isLoading,
  rowItem,
  campaignLink,
  onOpenCampaignSettings,
  onDuplicateCampaign,
  onOpenArchiveCampaignModal,
  onUnArchiveCampaign,
  onOpenCampaignDetails,
  onSetCampaignExpired,
  onDiscardDraft,
  isSelected,
  onToggleSelect,
}: ICampaignTableRowProps<ICampaignBreakdownListItem>): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const { breakpoints } = useTheme();
  const dispatch = useDispatch();
  const { trackEvent } = TrackEvent.useTrackEvent();

  const user = useSelector(User.selectors.getUser);

  const showCampaignTypeTooltip = useMediaQuery(breakpoints.down(breakpoints.values.xl));

  const hasA4MFeatureFlag = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.ALYCE_FOR_MARKETING), []),
  );

  const canEditCampaign = useMemo(() => user.canManageTeams.includes(rowItem.team.id), [user, rowItem]);
  const canCreateCampaign = user.canManageTeams.length > 0;

  const handleOpenSingleCampaign = useCallback(
    rowItemId => {
      trackEvent('Enterprise dashboard — link from campaigns page to single campaign view', {
        campaign_id: rowItemId,
      });
      dispatch(giftBreakDownClear());
    },
    [dispatch, trackEvent],
  );

  const onOpenGiftLinks = useCallback(
    campaign => {
      history.push(ActivateCampaignRoutes.buildEditorUrl(campaign.id, ActivateEditorStep.GiftLinks));
    },
    [history],
  );

  const hasEditor = Boolean(rowItem.updatedBy || rowItem.createdBy);
  const campaignLastEditorLabel = rowItem.updatedBy
    ? `Updated by ${rowItem.updatedBy}`
    : `Created by ${rowItem.createdBy}`;
  const campaignEditorLabel = hasEditor ? campaignLastEditorLabel : '';

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const showActions = useCallback(() => {
    setIsMenuOpened(true);
  }, []);

  const hideActions = useCallback(() => {
    setIsMenuOpened(false);
  }, []);

  const menuItems = useMemo<IMenuItem<ICampaignBreakdownListItem>[]>(
    () => [
      {
        id: 'details',
        text: 'View details',
        action: onOpenCampaignDetails,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: true,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.DISABLED, CAMPAIGN_STATUS.EXPIRED],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Details`,
      },
      {
        id: 'settings',
        text: 'Edit settings',
        action: onOpenCampaignSettings,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: canEditCampaign,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [
            CAMPAIGN_STATUS.ACTIVE,
            CAMPAIGN_STATUS.DISABLED,
            CAMPAIGN_STATUS.EXPIRED,
            CAMPAIGN_STATUS.DRAFT,
          ],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Settings`,
      },
      {
        id: 'duplicate',
        text: 'Duplicate',
        action: onDuplicateCampaign,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: canCreateCampaign,
          implementedForTypes: [CAMPAIGN_TYPES.STANDARD, CAMPAIGN_TYPES.PROSPECTING, CAMPAIGN_TYPES.ACTIVATE],
          possibleForStatuses: [
            CAMPAIGN_STATUS.ACTIVE,
            CAMPAIGN_STATUS.DISABLED,
            CAMPAIGN_STATUS.EXPIRED,
            CAMPAIGN_STATUS.ARCHIVED,
          ],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Duplicate`,
      },
      {
        id: 'expire',
        text: 'Expire',
        action: onSetCampaignExpired,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: canEditCampaign,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [CAMPAIGN_STATUS.ACTIVE],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Expire`,
      },
      {
        id: 'unexpire',
        text: 'Unexpire',
        action: onSetCampaignExpired,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: canEditCampaign,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [CAMPAIGN_STATUS.DISABLED, CAMPAIGN_STATUS.EXPIRED],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Unexpire`,
      },
      {
        id: 'discard',
        text: 'Discard draft',
        action: onDiscardDraft,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: canEditCampaign,
          implementedForTypes: [CAMPAIGN_TYPES.ACTIVATE, CAMPAIGN_TYPES.PROSPECTING],
          possibleForStatuses: [CAMPAIGN_STATUS.DRAFT],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Discard`,
      },
      {
        id: 'archive',
        text: 'Archive',
        action: onOpenArchiveCampaignModal,
        ...getArchiveAvailabilityOptions({
          campaigns: [rowItem],
          hasPermission: canEditCampaign,
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Archive`,
      },
      {
        id: 'unarchive',
        text: 'Unarchive',
        action: onUnArchiveCampaign,
        ...getUnArchiveAvailabilityOptions({
          campaigns: [rowItem],
          hasPermission: canEditCampaign,
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.Unarchive`,
      },
      {
        id: 'giftLinks',
        text: 'Gift links',
        action: onOpenGiftLinks,
        ...getActionAvailabilityOptions({
          campaign: rowItem,
          hasPermission: canEditCampaign,
          implementedForTypes: [CAMPAIGN_TYPES.ACTIVATE],
          possibleForTypes: [CAMPAIGN_TYPES.ACTIVATE],
          possibleForStatuses: [CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.EXPIRED],
        }),
        dataTestid: `CampaignManagement.Table.${rowItem.id}.Actions.GiftLinks`,
      },
    ],
    [
      onOpenCampaignSettings,
      rowItem,
      canEditCampaign,
      canCreateCampaign,
      onDuplicateCampaign,
      onOpenCampaignDetails,
      onSetCampaignExpired,
      onDiscardDraft,
      onOpenArchiveCampaignModal,
      onOpenGiftLinks,
      onUnArchiveCampaign,
    ],
  );

  const hasActions = useMemo(() => menuItems.some(({ hidden }) => !hidden), [menuItems]);

  return (
    <TableRow key={rowItem.id} onMouseEnter={showActions} onMouseLeave={hideActions} className={classes.tableRow}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onChange={(_, checked) => onToggleSelect(rowItem, checked)}
          data-testid={`CampaignManagement.Table.${rowItem.id}.Checkbox`}
        />
      </TableCell>
      <TableCell align="left">
        <Box position="relative" display="flex" flexDirection="column">
          <Box display="flex" width={1}>
            <TableLoadingLabel
              isLoading={isLoading}
              render={() => (
                <TableCellTooltip
                  lengthToShow={15}
                  renderLabel={() =>
                    rowItem.status === CAMPAIGN_STATUS.DRAFT || rowItem.status === CAMPAIGN_STATUS.ARCHIVED ? (
                      <Box color="primary.main" fontSize={14}>
                        {rowItem.name}
                      </Box>
                    ) : (
                      <NavLink
                        className={classes.tableData}
                        onClick={() => handleOpenSingleCampaign(rowItem.id)}
                        to={campaignLink(rowItem.id)}
                      >
                        {rowItem.name}
                      </NavLink>
                    )
                  }
                  title={rowItem.name}
                  placement="top-start"
                />
              )}
            />
          </Box>
          <Box display="flex" width={1}>
            <CampaignStatusLabel campaignStatus={rowItem.status} />
            {hasEditor && <Box className={classes.editor}>&nbsp;-&nbsp;{campaignEditorLabel}</Box>}
          </Box>
        </Box>
      </TableCell>
      <TableCell align="left">
        <TableLoadingLabel
          isLoading={isLoading}
          ml={2}
          mr={2}
          render={() => (
            <>
              {isMenuOpened && (
                <ActionsMenu<ICampaignBreakdownListItem>
                  menuId={`menu-id-${rowItem.id}`}
                  ActionButtonProps={{
                    disabled: !hasActions,
                    classes: {
                      root: classNames(classes.actionButton, { [classes.visibleActionButton]: isMenuOpened }),
                    },
                    endIcon: <Icon icon="chevron-down" />,
                    'data-testid': `CampaignManagement.Table.${rowItem.id}.Actions`,
                  }}
                  MenuProps={{
                    classes: {
                      root: classes.actionMenu,
                    },
                  }}
                  menuItems={menuItems}
                  menuData={rowItem}
                />
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell align="left">
        <TableLoadingLabel
          pr={2}
          className={classes.campaignType}
          isLoading={isLoading}
          render={() => (
            <Box display="flex">
              <CampaignTypeLabel campaignType={rowItem.type} />
              <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" pt={0.5}>
                {showCampaignTypeTooltip ? (
                  <TableCellTooltip
                    title={getCampaignTypeName(rowItem.type, hasA4MFeatureFlag)}
                    placement="top-start"
                    lengthToShow={19}
                  />
                ) : (
                  <Typography fontSize={14}>{getCampaignTypeName(rowItem.type, hasA4MFeatureFlag)}</Typography>
                )}
                <Box maxWidth={130}>
                  <CampaignCountries countryIds={rowItem.countryIds} />
                </Box>
              </Box>
            </Box>
          )}
        />
      </TableCell>
      <TableCell align="left">
        <TableLoadingLabel
          fontSize={14}
          isLoading={isLoading}
          render={() => <TableCellTooltip title={rowItem.team.name} placement="top-start" />}
        />
      </TableCell>
      <TableCell align="right">
        <TableLoadingLabel
          fontSize={14}
          align="right"
          pl={2}
          pr={3}
          isLoading={isLoading}
          render={() => rowItem.giftsSent ?? '-'}
        />
      </TableCell>
      <TableCell align="right">
        <TableLoadingLabel
          fontSize={14}
          align="right"
          pl={2}
          pr={3}
          isLoading={isLoading}
          render={() => rowItem.giftsViewed ?? '-'}
        />
      </TableCell>
      <TableCell align="right">
        <TableLoadingLabel
          fontSize={14}
          align="right"
          pl={2}
          pr={3}
          isLoading={isLoading}
          render={() => rowItem.giftsAccepted ?? '-'}
        />
      </TableCell>
      <TableCell align="right">
        <TableLoadingLabel
          fontSize={14}
          align="right"
          pr={3}
          isLoading={isLoading}
          render={() => rowItem.meetingsBooked ?? '-'}
        />
      </TableCell>
      <TableCell align="right">
        <TableLoadingLabel
          fontSize={14}
          align="right"
          pr={3}
          isLoading={isLoading}
          render={() => <NumberFormat format="$0,0.00">{rowItem.amountSpent}</NumberFormat>}
        />
      </TableCell>
    </TableRow>
  );
};

export default memo(CampaignTableRow);
