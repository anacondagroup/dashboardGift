import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionsMenu,
  ALL_ITEMS,
  AlyceTheme,
  Button,
  Icon,
  isAllItems,
  SearchField,
  SelectFilter,
  Tooltip,
} from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Box, FormControlLabel, Grid, MenuItem, Switch } from '@mui/material';
import { useDebounce } from 'react-use';
import { CommonData, CountriesPicker, Features, HasFeature, TCountry, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';

import {
  getIsCampaignsListLoading,
  getSelectedCampaigns,
} from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.selectors';
import { getTeams } from '../../../../../store/teams/teams.selectors';
import {
  SortField,
  TCampaignTableSetValues,
} from '../../../store/breakdowns/campaignsManagement/filters/filters.types';
import { createCampaignSidebarChooseCampaign } from '../../../../SettingsModule/store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import {
  getUnArchiveAvailabilityOptions,
  getArchiveAvailabilityOptions,
} from '../../../helpers/campaignsManagement.helpers';
import { ICampaignBreakdownListItem } from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';
import { CAMPAIGN_STATUS } from '../../../../../constants/campaignSettings.constants';
import { TABLE_SORT } from '../../../../../components/Shared/CustomTable/customTable.constants';
import { getTeamIsIncludeArchivedFilter } from '../../../store/breakdowns/campaignsManagement/filters/filters.selectors';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  selector: {
    minWidth: 150,
    marginLeft: spacing(1),
  },
  countriesButtonWrapper: {
    width: 150,
  },
  countryValueLabel: {
    color: palette.text.primary,
  },
  sortSelect: {
    minWidth: 126,
  },
  actionButton: {
    minWidth: 130,
    color: palette.link.main,
    height: '100%',
  },
  createBtn: {
    height: '100%',
    whiteSpace: 'nowrap',
    '&.Mui-disabled': {
      border: `1px solid ${palette.divider}`,
    },
  },
  tooltip: {
    backgroundColor: palette.common.white,
    color: palette.text.primary,
    padding: spacing(1.75, 2),
    maxWidth: 200,
    fontSize: 16,
    lineHeight: 1.5,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.25)',
    fontWeight: 'normal',
  },
  popper: {
    width: 320,
    minWidth: 320,
  },
}));

interface ICampaignTableToolbarProps {
  placeholder: string;
  search?: string;
  teamId?: number;
  countryIds?: number[];
  setValues: TCampaignTableSetValues;
  onOpenBulkArchiveCampaignsModal: (campaigns: ICampaignBreakdownListItem[]) => void;
  onUnArchiveCampaign: (campaigns: ICampaignBreakdownListItem[]) => void;
  sortField?: string;
  sortDirection: TABLE_SORT;
}

const CampaignTableToolbar = ({
  placeholder,
  search,
  setValues,
  teamId,
  countryIds,
  onOpenBulkArchiveCampaignsModal,
  onUnArchiveCampaign,
  sortField,
  sortDirection,
}: ICampaignTableToolbarProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { trackEvent } = TrackEvent.useTrackEvent();

  const isLoading = useSelector(getIsCampaignsListLoading);
  const isIncludeArchived = useSelector(getTeamIsIncludeArchivedFilter);
  const teams = useSelector(getTeams);

  const isArchivedTeamsExist = useMemo(() => teams.filter(team => team.archivedAt !== null).length > 0, [teams]);

  const countries = useSelector(CommonData.selectors.getCommonCountries);
  const selectedCountries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(countryIds || []), [countryIds]),
  );

  const user = useSelector(User.selectors.getUser);
  const managedTeams = useSelector(User.selectors.getUserCanManageTeams);
  const isCreateCampaignDisabled = managedTeams.length === 0;

  const selectedCampaigns = useSelector(getSelectedCampaigns);

  const isMount = useRef(false);
  const [searchValue, setSearchValue] = useState(search);

  const handleSearchChanges = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value),
    [],
  );

  useDebounce(
    () => {
      if (isMount.current) {
        setValues({
          search: searchValue,
          currentPage: 1,
          status: CAMPAIGN_STATUS.ACTIVE,
        });
      }
      isMount.current = true;
    },
    300,
    [searchValue],
  );

  const filteredTeams = useMemo(
    () => [
      { id: ALL_ITEMS, name: 'All teams' },
      ...teams
        .filter(team => {
          if (!isIncludeArchived) {
            return team.archivedAt === null && team.settings.enterprise_mode_enabled;
          }
          return team.settings.enterprise_mode_enabled;
        })
        .map(team => ({ ...team, id: team.id.toString() })),
    ],
    [teams, isIncludeArchived],
  );

  const teamChangeHandler = useCallback(
    (newTeamId?: number | null) => {
      setValues({ currentPage: 1, teamId: newTeamId, status: CAMPAIGN_STATUS.ACTIVE });
    },
    [setValues],
  );

  const handleChangeCountries = useCallback(
    (selected: TCountry[]) => {
      setValues({
        currentPage: 1,
        countryIds: selected.length ? selected.map(({ id }) => id) : null,
        status: CAMPAIGN_STATUS.ACTIVE,
      });
    },
    [setValues],
  );

  const handleIncludeArchived = useCallback(
    (_, status) => {
      trackEvent('Include archived — clicked', { page: 'campaigns', includeArchived: status ? 'yes' : 'no' });
      const newTeamFilter = teams.find(team => team.id === teamId && team.archivedAt !== null) ? null : teamId;
      setValues({
        includeArchived: status,
        teamId: newTeamFilter,
      });
    },
    [teamId, teams, trackEvent, setValues],
  );

  const handleChangeSort = useCallback(
    (newSort: { sortField: SortField; sortDirection: TABLE_SORT }) => {
      setValues({
        ...newSort,
        currentPage: 1,
        status: CAMPAIGN_STATUS.ACTIVE,
      });
    },
    [setValues],
  );

  const sortMenuItems = useMemo(
    () => [
      {
        id: SortField.Name,
        text: 'Name (A-Z)',
        data: { sortField: SortField.Name, sortDirection: TABLE_SORT.ASC },
        action: handleChangeSort,
        dataTestid: 'CampaignsManagement.Sort.Name',
      },
      {
        id: SortField.Updated,
        text: 'Recently updated',
        data: { sortField: SortField.Updated, sortDirection: TABLE_SORT.DESC },
        action: handleChangeSort,
        dataTestid: 'CampaignsManagement.Sort.Updated',
      },
      {
        id: SortField.Created,
        text: 'Recently created',
        data: { sortField: SortField.Created, sortDirection: TABLE_SORT.DESC },
        action: handleChangeSort,
        dataTestid: 'CampaignsManagement.Sort.Created',
      },
    ],
    [handleChangeSort],
  );

  const sortMenuValue = useMemo(
    () =>
      sortMenuItems.find(({ data }) => data.sortField === sortField && data.sortDirection === sortDirection)?.id || '',
    [sortMenuItems, sortField, sortDirection],
  );

  const handleClickCreateCampaign = useCallback(() => {
    dispatch(createCampaignSidebarChooseCampaign());
  }, [dispatch]);

  const canEditCampaign = useMemo(
    () => selectedCampaigns.some(campaign => user.canManageTeams.includes(campaign.team.id)),
    [selectedCampaigns, user],
  );

  const bulkMenuItems = useMemo(
    () => [
      {
        id: 'archive',
        text: 'Archive',
        action: () => onOpenBulkArchiveCampaignsModal(selectedCampaigns),
        ...getArchiveAvailabilityOptions({
          campaigns: selectedCampaigns,
          hasPermission: canEditCampaign,
          tooltip: !canEditCampaign ? 'You don’t have the right permissions' : undefined,
        }),
        hidden: false,
        dataTestid: 'CampaignsManagement.Actions.Archive',
      },
      {
        id: 'unarchive',
        text: 'Unarchive',
        action: () => onUnArchiveCampaign(selectedCampaigns),
        ...getUnArchiveAvailabilityOptions({
          campaigns: selectedCampaigns,
          hasPermission: canEditCampaign,
        }),
        dataTestid: `CampaignManagement.Actions.Unarchive`,
      },
    ],
    [onOpenBulkArchiveCampaignsModal, onUnArchiveCampaign, selectedCampaigns, canEditCampaign],
  );

  const isBulkMenuDisabled = useMemo(
    () => selectedCampaigns.length === 0 || isLoading || bulkMenuItems.every(({ hidden }) => hidden),
    [selectedCampaigns, isLoading, bulkMenuItems],
  );

  useEffect(() => {
    if (teams.length === 1) {
      setValues({ teamId: teams[0].id });
    }
  }, [teams, setValues]);

  return (
    <Box mb={3}>
      <Grid container direction="row" wrap="nowrap" justifyContent="space-between">
        <Box display="flex">
          <Box width="200px">
            <SearchField placeholder={placeholder} value={searchValue} onChange={handleSearchChanges} />
          </Box>
          <SelectFilter
            name="filter"
            label="Team"
            value={teamId || ALL_ITEMS}
            disabled={isLoading}
            onFilterChange={({ filter }) => teamChangeHandler(isAllItems(filter) ? null : Number(filter))}
            renderItems={() =>
              filteredTeams.map(filterItem => (
                <MenuItem key={filterItem.id} value={filterItem.id}>
                  {filterItem.name}
                </MenuItem>
              ))
            }
            classes={{ root: classes.selector }}
          />
          <Box ml={1}>
            <CountriesPicker<true>
              label="All countries"
              searchLabel="Search countries"
              name="countries"
              value={selectedCountries}
              onChange={handleChangeCountries}
              options={countries}
              multiple
              classes={{
                buttonWrapper: classes.countriesButtonWrapper,
                valueLabel: classes.countryValueLabel,
                popper: classes.popper,
              }}
            />
          </Box>
          <Box ml={1}>
            <SelectFilter
              fullWidth
              name="sort"
              label="Sort"
              value={sortMenuValue}
              renderItems={() =>
                sortMenuItems.map(item => (
                  <MenuItem key={item.id} value={item.id} onClick={() => item.action(item.data)}>
                    {item.text}
                  </MenuItem>
                ))
              }
              classes={{ root: classes.sortSelect }}
              dataTestId="CampaignsManagement.Sort"
            />
          </Box>
        </Box>
        <Box ml={3} display="flex">
          <Box>
            <ActionsMenu
              menuId="bulk-menu-id"
              ActionButtonProps={{
                classes: { root: classes.actionButton },
                endIcon: <Icon icon="chevron-down" />,
                disabled: isBulkMenuDisabled,
                'data-testid': `CampaignsManagement.Actions`,
              }}
              menuItems={bulkMenuItems}
              menuData={{}}
            />
          </Box>
          <Box ml={1}>
            {isCreateCampaignDisabled ? (
              <Tooltip
                title="You don't have the right permissions."
                placement="bottom-end"
                arrow
                classes={{ tooltip: classes.tooltip }}
              >
                <Button
                  onClick={handleClickCreateCampaign}
                  disabled={isCreateCampaignDisabled}
                  color="secondary"
                  className={classes.createBtn}
                  data-testid="CampaignsManagement.CreateCampaign"
                >
                  Create a campaign
                </Button>
              </Tooltip>
            ) : (
              <Button
                onClick={handleClickCreateCampaign}
                color="secondary"
                className={classes.createBtn}
                data-testid="CampaignsManagement.CreateCampaign"
              >
                Create a campaign
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
      {isArchivedTeamsExist && (
        <HasFeature featureKey={Features.FLAGS.ARCHIVE_TEAMS}>
          <Grid>
            <FormControlLabel
              control={<Switch checked={isIncludeArchived} onChange={handleIncludeArchived} color="primary" />}
              label="Include archived"
            />
          </Grid>
        </HasFeature>
      )}
    </Box>
  );
};

export default memo(CampaignTableToolbar);
