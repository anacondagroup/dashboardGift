/* eslint-disable react/no-danger */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import numeral from 'numeral';
import classNames from 'classnames';
import * as R from 'ramda';
import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Slide,
  Checkbox,
  Table,
  Avatar,
  MenuItem,
  Tooltip,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { DashboardIcon, SearchField, AlyceLoading, SelectFilter, ActionButton } from '@alycecom/ui';

import { usePagination } from '../../../../hooks/usePagination';

const useStyles = makeStyles(theme => ({
  protipIcon: {
    color: theme.palette.green.main,
  },
  radioButtonsGroup: {
    flexDirection: 'row',
  },
  checkboxColumn: {
    width: '60px',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  headerCell: {
    zIndex: 10,
  },
  noBorderBottom: {
    borderBottom: 'none',
    height: 40,
  },
  descriptionWrapper: {
    '& p': {
      padding: 0,
      margin: 0,
    },
  },
}));

const MarketplaceVendorsRestrictionsTable = ({
  area,
  vendors,
  onChangeVendorRestricted,
  isLoading,
  onCheckAll,
  onSubmit,
}) => {
  const [page, setPage] = useState(0);
  const [showVendors, setShowVendors] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    column: 'id',
    order: 'asc',
  });
  const classes = useStyles();
  const [vendorsFilter, setVendorsFilter] = useState('all');

  const restrictedFieldName = useMemo(() => (area === 'campaign' ? 'is_campaign_restricted' : 'is_restricted'), [area]);

  const handleSort = useCallback(
    column => {
      setSort({
        column,
        order: sort.column === column && sort.order === 'desc' ? 'asc' : 'desc',
      });
      setPage(0);
    },
    [sort],
  );

  const handleSearch = value => {
    setSearch(value);
    setPage(0);
  };

  const handleFilter = value => {
    setVendorsFilter(value);
    setPage(0);
  };

  const handleToggleAll = value => {
    onCheckAll(value);
    setVendorsFilter('all');
    setPage(0);
  };

  const allNotRestricted = useMemo(() => R.all(vendor => !vendor[restrictedFieldName], vendors), [
    restrictedFieldName,
    vendors,
  ]);
  const restrictedAmount = useMemo(
    () => vendors.filter(vendor => vendor[restrictedFieldName] || vendor.is_team_restricted).length,
    [restrictedFieldName, vendors],
  );
  const allowedAmount = useMemo(
    () => vendors.filter(vendor => !vendor[restrictedFieldName] && !vendor.is_team_restricted).length,
    [restrictedFieldName, vendors],
  );

  const processedItems = useMemo(
    () =>
      R.compose(
        R.cond([
          [R.equals('restricted'), () => R.filter(vendor => vendor[restrictedFieldName] || vendor.is_team_restricted)],
          [R.equals('all'), () => R.identity],
          [R.equals('allowed'), () => R.filter(vendor => !vendor[restrictedFieldName] && !vendor.is_team_restricted)],
        ])(vendorsFilter),
        R.sort(sort.order === 'asc' ? R.ascend(R.prop(sort.column)) : R.descend(R.prop(sort.column))),
        R.filter(
          vendor =>
            vendor.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            vendor.description.toLowerCase().includes(search.toLocaleLowerCase()),
        ),
      )(vendors),
    [vendorsFilter, sort, vendors, restrictedFieldName, search],
  );

  const hasTeamRestricted = R.any(vendor => vendor.is_team_restricted, vendors);
  const hasRestricted = restrictedAmount > 0;

  useEffect(() => {
    if (hasRestricted) {
      setShowVendors('specific');
    }
  }, [hasRestricted]);

  const filters = [
    {
      value: 'all',
      label: `View all vendors (${numeral(vendors.length).format('0,0')})`,
    },
    {
      value: 'allowed',
      label: `View only allowed vendors (${numeral(allowedAmount).format('0,0')})`,
    },
    {
      value: 'restricted',
      label: `View only restricted vendors (${numeral(restrictedAmount).format('0,0')})`,
    },
  ];

  const rowsPerPage = 10;
  const [pagedVendors, showPagination, emptyRows, showEmptyRows] = usePagination(page, 10, processedItems, isLoading);

  return (
    <Box>
      <Box pt={3} pb={3}>
        <RadioGroup
          className={classes.radioButtonsGroup}
          value={showVendors}
          onChange={e => setShowVendors(e.target.value)}
        >
          <FormControlLabel
            value="all"
            control={<Radio disabled={hasTeamRestricted} onClick={() => onCheckAll(false)} color="primary" />}
            label="Allow all gift vendors"
          />
          <FormControlLabel value="specific" control={<Radio color="primary" />} label="Allow specific gift vendors" />
        </RadioGroup>
      </Box>
      <Slide direction="up" in={showVendors === 'specific'} mountOnEnter unmountOnExit>
        <Box>
          <AlyceLoading isLoading={isLoading}>
            <Box>
              <Divider />
              <Box pt={3} pb={3} display="flex" flexDirection="row" alignItems="center">
                <Box className="Body-Regular-Left-Static-Bold" pr={2}>
                  {numeral(allowedAmount).format('0,0')} vendors selected
                </Box>
              </Box>
              <Box display="flex" flexDirection="row">
                <Box pt={2} pr={2} width="70%">
                  <SearchField
                    fullWidth
                    placeholder="Search gift vendors"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                  />
                </Box>
                <Box width="30%">
                  <SelectFilter
                    label=""
                    fullWidth
                    margin="normal"
                    onFilterChange={e => handleFilter(e.filter)}
                    renderItems={() =>
                      filters.map(filter => (
                        <MenuItem key={filter.value} value={filter.value}>
                          {filter.label}
                        </MenuItem>
                      ))
                    }
                    value={vendorsFilter}
                    name="filter"
                  />
                </Box>
              </Box>
              {area === 'campaign' && (
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
                  <DashboardIcon icon="graduation-cap" className={classes.protipIcon} />
                  <Box pl={2} className="Subcopy-Static-Alt">
                    Tip: Any vendors that are locked on this campaign are locked because they’ve been set as such on the
                    team settings.
                  </Box>
                </Box>
              )}
              <Box width={1}>
                <Table padding="none" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classNames(classes.checkboxColumn, classes.headerCell)}>
                        <Checkbox
                          color="primary"
                          checked={allNotRestricted}
                          onChange={() => handleToggleAll(allNotRestricted)}
                        />
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        <TableSortLabel
                          direction={sort.order}
                          active={sort.column === 'name'}
                          onClick={() => handleSort('name')}
                        >
                          name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        <TableSortLabel
                          direction={sort.order}
                          active={sort.column === 'marketplace'}
                          onClick={() => handleSort('marketplace')}
                        >
                          marketplace
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        <TableSortLabel
                          direction={sort.order}
                          active={sort.column === 'description'}
                          onClick={() => handleSort('description')}
                        >
                          description
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedVendors.map(vendor => (
                      <TableRow key={`${vendor.id}-${vendor.type}`}>
                        <TableCell>
                          {vendor.is_team_restricted ? (
                            <Box p={1.5}>
                              <Tooltip title={`${vendor.name} locked on the team level`}>
                                <div>
                                  <DashboardIcon icon="lock-alt" />
                                </div>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Checkbox
                              color="primary"
                              checked={!vendor[restrictedFieldName]}
                              onChange={() =>
                                onChangeVendorRestricted(
                                  { id: vendor.id, type: vendor.type },
                                  !vendor[restrictedFieldName],
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell className={vendor.is_team_restricted ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                          <Box display="flex" flexDirection="row" alignItems="center" width="280px">
                            <Avatar className={classes.avatar} src={vendor.logo_url} />
                            {vendor.name}
                          </Box>
                        </TableCell>
                        <TableCell className={vendor.is_team_restricted ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                          {vendor.countries && vendor.countries.join(' / ')}
                        </TableCell>
                        <TableCell className={vendor.is_team_restricted ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: vendor.description }} />}>
                            <Box className="Text-Pointer" maxHeight="56px" pt={1} pb={1} overflow="hidden">
                              <div
                                className={classes.descriptionWrapper}
                                dangerouslySetInnerHTML={{ __html: vendor.description }}
                              />
                            </Box>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {showEmptyRows > 0 && (
                      <TableRow style={{ height: 48 * emptyRows }}>
                        <TableCell colSpan={12} />
                      </TableRow>
                    )}
                  </TableBody>
                  {showPagination && (
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          className={classes.noBorderBottom}
                          rowsPerPageOptions={[rowsPerPage]}
                          colSpan={12}
                          count={vendors.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            native: true,
                          }}
                          onPageChange={(event, nextPage) => setPage(nextPage)}
                        />
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </Box>
            </Box>
          </AlyceLoading>
        </Box>
      </Slide>
      <Box pt={2} width={1} display="flex" justifyContent="space-between">
        <ActionButton width={120} onClick={onSubmit} disabled={isLoading}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

MarketplaceVendorsRestrictionsTable.propTypes = {
  area: PropTypes.oneOf(['team', 'campaign']),
  // eslint-disable-next-line react/forbid-prop-types
  vendors: PropTypes.array.isRequired,
  onChangeVendorRestricted: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

MarketplaceVendorsRestrictionsTable.defaultProps = {
  area: 'campaign',
};

export default MarketplaceVendorsRestrictionsTable;
