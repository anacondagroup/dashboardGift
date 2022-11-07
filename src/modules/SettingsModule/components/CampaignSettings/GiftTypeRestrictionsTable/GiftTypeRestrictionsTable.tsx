import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { findIndex, propEq, assoc, converge, adjust, always, identity } from 'ramda';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, AlyceLoading, AlyceTheme, Icon, SearchField, Tooltip } from '@alycecom/ui';
import { CommonData, CountriesNames, CountriesPicker, TCountry } from '@alycecom/modules';
import { SortDirection, formatTestId } from '@alycecom/utils';
import { useDispatch, useSelector } from 'react-redux';

import { GiftTypeOption } from '../../../constants/giftTypes.constants';
import {
  getGiftInvitesTypes,
  getGiftTypesSelectedCount,
  getHasRestrictedGiftTypes,
  getHasTeamOrCountryRestrictedGiftTypes,
  getIsAllGiftTypesNotRestricted,
  getIsAllGiftTypesRestricted,
  getIsGiftInvitesTypesLoading,
} from '../../../store/campaign/giftInvites/giftInvites.selectors';
import {
  saveCampaignTypeRestrictionsRequest,
  setRestrictedCampaignTypes,
} from '../../../store/campaign/giftInvites/giftInvites.actions';
import { updateSelectedAllGiftTypes } from '../../../store/campaign/giftInvites/giftInvites.helpers';
import { getLocalSortedGiftTypes } from '../../../helpers/giftTypes.helpers';
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  protipIcon: {
    color: palette.green.main,
  },
  radioButtonsGroup: {
    flexDirection: 'row',
  },
  checkboxColumn: {
    width: 60,
  },
  countryButtonWrapper: {
    width: 150,
    minWidth: '100%',
  },
  countryValueLabel: {
    overflow: 'hidden',
  },
  teamLink: {
    display: 'inline',
  },
  popper: {
    width: 320,
    minWidth: 320,
  },
}));

enum GiftTypeTableColumnName {
  id = 'id',
  name = 'name',
  countries = 'countries',
  description = 'description',
}

interface IGiftTypeRestrictionsTableProps {
  teamId: number;
  campaignId: number;
  campaignType: CAMPAIGN_TYPES;
}

const GiftTypeRestrictionsTable = ({
  teamId,
  campaignId,
  campaignType,
}: IGiftTypeRestrictionsTableProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const giftTypes = useSelector(getGiftInvitesTypes);
  const isLoading = useSelector(getIsGiftInvitesTypesLoading);
  const selectedTypesCount = useSelector(getGiftTypesSelectedCount);
  const allNotRestricted = useSelector(getIsAllGiftTypesNotRestricted);
  const allRestricted = useSelector(getIsAllGiftTypesRestricted);
  const hasTeamOrCountryRestricted = useSelector(getHasTeamOrCountryRestrictedGiftTypes);
  const hasRestricted = useSelector(getHasRestrictedGiftTypes);
  const countries = useSelector(CommonData.selectors.getCommonCountries);

  const [showTypes, setShowTypes] = useState(GiftTypeOption.all);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    column: GiftTypeTableColumnName.id,
    order: SortDirection.asc,
  });
  const [selectedCountries, setSelectedCountries] = useState<TCountry[]>([]);

  const processedItems = useMemo(() => {
    const countryIds = selectedCountries.map(country => country.id);
    return getLocalSortedGiftTypes({ giftTypes, sorting: sort, selectedCountryIds: countryIds, search });
  }, [sort, search, giftTypes, selectedCountries]);

  const handleSort = useCallback(
    column => {
      setSort({
        column,
        order: sort.column === column && sort.order === SortDirection.desc ? SortDirection.asc : SortDirection.desc,
      });
    },
    [sort],
  );

  const handleCheckAll = useCallback(
    isAllNotRestricted => {
      const updatedGiftTypes = updateSelectedAllGiftTypes(isAllNotRestricted)(giftTypes);
      dispatch(setRestrictedCampaignTypes(updatedGiftTypes));
    },
    [dispatch, giftTypes],
  );

  const handleChangeTypeRestricted = useCallback(
    (id, value) => {
      const getIndex = findIndex(propEq('id', id));
      const updateItem = always(assoc('is_campaign_restricted', value));
      const updatedGiftTypes = converge(adjust, [getIndex, updateItem, identity])(giftTypes);

      dispatch(setRestrictedCampaignTypes(updatedGiftTypes));
    },
    [dispatch, giftTypes],
  );

  const handleSaveGiftTypes = useCallback(() => {
    dispatch(saveCampaignTypeRestrictionsRequest({ campaignId, campaignType }));
  }, [dispatch, campaignId, campaignType]);

  const handleChangeGiftTypeOption = useCallback(({ target }) => setShowTypes(target.value), [setShowTypes]);

  const handleChangeSelectedCountries = useCallback(
    selected => {
      setSelectedCountries(selected);
    },
    [setSelectedCountries],
  );

  useEffect(() => {
    if (hasRestricted) {
      setShowTypes(GiftTypeOption.specific);
    }
  }, [hasRestricted]);

  return (
    <Box>
      <Box pt={3} pb={3}>
        <RadioGroup className={classes.radioButtonsGroup} value={showTypes} onChange={handleChangeGiftTypeOption}>
          <FormControlLabel
            value={GiftTypeOption.all}
            control={
              <Radio disabled={hasTeamOrCountryRestricted} onClick={() => handleCheckAll(false)} color="primary" />
            }
            label="Allow all gift types"
          />
          <FormControlLabel
            value={GiftTypeOption.specific}
            control={<Radio color="primary" />}
            label="Allow specific gift types"
          />
        </RadioGroup>
      </Box>
      <Slide direction="up" in={showTypes === 'specific'} mountOnEnter unmountOnExit>
        <Box>
          <AlyceLoading isLoading={isLoading}>
            <Box>
              <Divider />
              <Box pt={3} pb={3} display="flex" alignItems="center">
                <Box className="Body-Regular-Left-Static-Bold" pr={2}>
                  {selectedTypesCount} type selected
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <SearchField
                  fullWidth
                  placeholder="Search gift types"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Box width={350} ml={1}>
                  <CountriesPicker<true>
                    label="Country"
                    searchLabel="Search countries"
                    name="countryId"
                    value={selectedCountries}
                    onChange={handleChangeSelectedCountries}
                    options={countries}
                    multiple
                    classes={{
                      valueLabel: classes.countryValueLabel,
                      buttonWrapper: classes.countryButtonWrapper,
                      popper: classes.popper,
                    }}
                    buttonIconProps={{ fontSize: 0.8 }}
                  />
                </Box>
              </Box>
              <Box
                mt={3}
                mb={3}
                p={2}
                width={1}
                height="58px"
                bgcolor="green.fruitSaladLight"
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Icon icon="graduation-cap" className={classes.protipIcon} />
                <Box pl={2} className="Subcopy-Static-Alt">
                  Tip: Any gift types that are locked on this campaign are locked because they’ve been set as such on
                  the team settings. &nbsp;
                  <Link
                    className={classes.teamLink}
                    href={`/settings/teams/${teamId}/settings-and-permissions/gift-invites`}
                  >
                    Modify your team settings
                  </Link>
                </Box>
              </Box>
              <Table padding="none">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.checkboxColumn}>
                      <TableSortLabel>
                        <Checkbox
                          color="primary"
                          checked={allNotRestricted}
                          disabled={allRestricted}
                          onChange={() => handleCheckAll(allNotRestricted)}
                        />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        direction={sort.order}
                        active={sort.column === GiftTypeTableColumnName.name}
                        onClick={() => handleSort(GiftTypeTableColumnName.name)}
                      >
                        name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell width={350}>
                      <TableSortLabel hideSortIcon>country</TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        direction={sort.order}
                        active={sort.column === GiftTypeTableColumnName.description}
                        onClick={() => handleSort(GiftTypeTableColumnName.description)}
                      >
                        description
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedItems.map(type => {
                    const isGiftTypeBlockedByCountry = type.countryIds.length === 0;
                    const tipForBlockedGiftType = isGiftTypeBlockedByCountry
                      ? 'The gift type is not available for your selected countries yet. Check back soon.'
                      : '';
                    return (
                      <TableRow key={type.id}>
                        <TableCell
                          data-testid={`GiftTypeRestrictionsTable.TableCell.Checkbox.${formatTestId(type.name)}`}
                        >
                          {type.is_team_restricted ? (
                            <Box p={1.5}>
                              <Tooltip title={`${type.name} locked on the team level`}>
                                <div>
                                  <Icon icon="lock-alt" />
                                </div>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Tooltip title={tipForBlockedGiftType} placement="top-start">
                              <div>
                                <Checkbox
                                  name={type.name}
                                  color="primary"
                                  checked={!type.is_campaign_restricted}
                                  disabled={isGiftTypeBlockedByCountry}
                                  onChange={() => handleChangeTypeRestricted(type.id, !type.is_campaign_restricted)}
                                />
                              </div>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell
                          width={250}
                          className={type.is_team_restricted ? 'Tables-Textual-Disabled' : 'Tables-Textual'}
                        >
                          {type.name}
                        </TableCell>
                        <TableCell>
                          {isGiftTypeBlockedByCountry ? '-' : <CountriesNames countryIds={type.countryIds} />}
                        </TableCell>
                        <TableCell className={type.is_team_restricted ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                          {type.description}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </AlyceLoading>
        </Box>
      </Slide>
      <Box pt={2} width={1} display="flex" justifyContent="space-between">
        <ActionButton width={120} onClick={handleSaveGiftTypes}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

export default memo<IGiftTypeRestrictionsTableProps>(GiftTypeRestrictionsTable);
