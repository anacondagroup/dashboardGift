import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as R from 'ramda';
import {
  Box,
  Table,
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
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { SearchField, AlyceLoading, ActionButton } from '@alycecom/ui';

const useStyles = makeStyles(theme => ({
  protipIcon: {
    color: theme.palette.green.main,
  },
  radioButtonsGroup: {
    flexDirection: 'row',
  },
  checkboxColumn: {
    width: 60,
  },
}));

const TeamGiftTypeRestrictionsTable = ({
  types,
  isLoading,
  selectedTypes,
  onChangeTypeRestricted,
  onCheckAll,
  onSubmit,
}) => {
  const [showTypes, setShowTypes] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    column: 'id',
    order: 'asc',
  });
  const classes = useStyles();

  const handleSort = useCallback(
    column => {
      setSort({
        column,
        order: sort.column === column && sort.order === 'desc' ? 'asc' : 'desc',
      });
    },
    [sort],
  );

  const allNotRestricted = R.compose(
    R.all(type => !type.is_restricted),
    R.filter(type => !type.is_team_restricted),
  )(types);

  const processedItems = useMemo(
    () =>
      R.compose(
        R.sort(sort.order === 'asc' ? R.ascend(R.prop(sort.column)) : R.descend(R.prop(sort.column))),
        R.filter(
          type =>
            type.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            (type.description && type.description.toLowerCase().includes(search.toLocaleLowerCase())),
        ),
      )(types),
    [sort, search, types],
  );

  const hasRestricted = R.any(type => type.is_restricted, types);

  useEffect(() => {
    if (hasRestricted) {
      setShowTypes('specific');
    }
  }, [hasRestricted]);

  return (
    <Box>
      <Box pt={3} pb={3}>
        <RadioGroup
          className={classes.radioButtonsGroup}
          value={showTypes}
          onChange={e => setShowTypes(e.target.value)}
        >
          <FormControlLabel
            value="all"
            control={<Radio onClick={() => onCheckAll(false)} color="primary" />}
            label="Allow all gift types"
          />
          <FormControlLabel value="specific" control={<Radio color="primary" />} label="Allow specific gift types" />
        </RadioGroup>
      </Box>
      <Slide direction="up" in={showTypes === 'specific'} mountOnEnter unmountOnExit>
        <Box>
          <AlyceLoading isLoading={isLoading}>
            <Box>
              <Divider />
              <Box pt={3} pb={3} display="flex" flexDirection="row" alignItems="center">
                <Box className="Body-Regular-Left-Static-Bold" pr={2}>
                  {selectedTypes} type selected
                </Box>
              </Box>
              <SearchField
                fullWidth
                placeholder="Search gift types"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Table padding="none">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.checkboxColumn}>
                      <TableSortLabel>
                        <Checkbox
                          color="primary"
                          checked={allNotRestricted}
                          onChange={() => onCheckAll(allNotRestricted)}
                        />
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        direction={sort.order}
                        active={sort.column === 'name'}
                        onClick={() => handleSort('name')}
                      >
                        name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
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
                  {processedItems.map(type => (
                    <TableRow key={type.id}>
                      <TableCell>
                        <Checkbox
                          color="primary"
                          checked={!type.is_restricted}
                          onChange={() => onChangeTypeRestricted(type.id, !type.is_restricted)}
                        />
                      </TableCell>
                      <TableCell className="Tables-Textual">{type.name}</TableCell>
                      <TableCell className="Tables-Textual">{type.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </AlyceLoading>
        </Box>
      </Slide>
      <Box pt={2} width={1} display="flex" justifyContent="space-between">
        <ActionButton width={120} onClick={onSubmit}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

TeamGiftTypeRestrictionsTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  types: PropTypes.array.isRequired,
  selectedTypes: PropTypes.number.isRequired,
  onChangeTypeRestricted: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default TeamGiftTypeRestrictionsTable;
