import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  pipe,
  findIndex,
  propEq,
  assoc,
  always,
  converge,
  adjust,
  identity,
  sort,
  prop,
  ascend,
  descend,
  filter,
  pluck,
} from 'ramda';
import { Box, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Checkbox, Table, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { AlyceLoading, ActionButton, LoadingLabel } from '@alycecom/ui';

const useStyles = makeStyles(theme => ({
  checkboxColumn: {
    width: 60,
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  headerCell: {
    width: 200,
    zIndex: 10,
  },
  link: {
    cursor: 'pointer',
    display: 'inline-block',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const GiftInvitationMethodsTable = ({ methods, isLoading, onSubmit }) => {
  const classes = useStyles();
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortProp, setSortProp] = useState('label');
  const [localMethods, setLocalMethods] = useState(methods);
  const enabledMethods = useMemo(() => localMethods.filter(method => method.enabled), [localMethods]);
  const toggleSortDirection = useCallback(
    newSortProp => {
      setSortProp(newSortProp);
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    },
    [sortDirection],
  );

  const handleChangeMethodRestricted = useCallback(
    (id, value) => {
      if (!value && enabledMethods.length <= 1) {
        return;
      }
      const getIndex = findIndex(propEq('id', id));
      const updateItem = always(assoc('enabled', value));
      setLocalMethods(converge(adjust, [getIndex, updateItem, identity])(localMethods));
    },
    [enabledMethods.length, localMethods],
  );

  const handleSubmit = useCallback(() => {
    const getEnabled = pipe(filter(propEq('enabled', false)), pluck('id'));
    onSubmit(getEnabled(localMethods));
  }, [localMethods, onSubmit]);

  const sortedMethods = useMemo(() => {
    const sortFn = sortDirection === 'asc' ? ascend : descend;
    return sort(sortFn(prop(sortProp)), localMethods);
  }, [localMethods, sortDirection, sortProp]);

  useEffect(() => {
    setLocalMethods(methods);
  }, [methods]);

  return (
    <Box>
      <Box>
        <AlyceLoading isLoading={methods.length === 0}>
          <Box width={1}>
            <Table padding="none">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headerCell}>
                    <TableSortLabel
                      direction={sortDirection}
                      active={sortProp === 'name'}
                      onClick={() => {
                        toggleSortDirection('name');
                      }}
                    >
                      <Box pl={1.5}>name</Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.headerCell}>
                    <TableSortLabel
                      direction={sortDirection}
                      active={sortProp === 'usedInCampaignsCount'}
                      onClick={() => {
                        toggleSortDirection('usedInCampaignsCount');
                      }}
                    >
                      <Box pl={1.5}>Usage</Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.headerCell}>
                    <TableSortLabel
                      direction={sortDirection}
                      active={sortProp === 'remaining_items'}
                      onClick={() => {
                        toggleSortDirection('remaining_items');
                      }}
                    >
                      <Box pl={1.5}>Remaining</Box>
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMethods.map(method => (
                  <TableRow key={method.id}>
                    <TableCell className={!method.enabled ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                      <Box display="flex" flexDirection="row" alignItems="center" width={1}>
                        <Checkbox
                          color="primary"
                          checked={method.enabled}
                          disabled={isLoading || (method.enabled && enabledMethods.length === 1)}
                          onChange={() => handleChangeMethodRestricted(method.id, !method.enabled)}
                        />
                        <Avatar className={classes.avatar} src={method.image} />
                        {isLoading ? <LoadingLabel mt="19px" mb="19px" /> : method.name}
                      </Box>
                    </TableCell>
                    <TableCell className={!method.enabled ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                      Used in {method.usedInCampaignsCount} campaigns
                    </TableCell>
                    <TableCell className={!method.enabled ? 'Tables-Textual-Disabled' : 'Tables-Textual'}>
                      {method.remaining_items}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </AlyceLoading>
      </Box>
      <Box pt={2} width={1} display="flex" justifyContent="space-between">
        <ActionButton disabled={isLoading} width={100} onClick={handleSubmit}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

GiftInvitationMethodsTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  methods: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default GiftInvitationMethodsTable;
