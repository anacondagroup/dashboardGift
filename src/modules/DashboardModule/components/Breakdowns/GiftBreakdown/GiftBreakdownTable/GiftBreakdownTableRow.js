import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Avatar, Grid, TableCell, TableRow } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LinkButton, DashboardIcon, TableCellTooltip, TableLoadingLabel } from '@alycecom/ui';
import { propertyByPath } from '@alycecom/utils';

import { ColumnType } from './giftBreakdownTable.shape';

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
}));

const GiftBreakdownTableRow = ({ item, columns, isLoading }) => {
  const classes = useStyles();
  const getFormattedValue = ({ field, getValue, formatValue = v => v }, dataItem) => {
    const value = getValue ? getValue(dataItem) : propertyByPath(field)(dataItem);
    return value ? formatValue(value) : '-';
  };

  return (
    <TableRow data-testid="Breakdown.Row">
      {columns.map((column, index) => (
        <React.Fragment key={column.field}>
          {index === 0 && (
            <TableCell component="th" scope="row">
              <Grid container direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap">
                <Avatar
                  alt={isLoading ? '' : getFormattedValue(column, item)}
                  className={classNames(classes.avatar, classes.fakeAvatar)}
                >
                  <DashboardIcon icon="user" className={classes.fakeAvatarIcon} />
                </Avatar>
                <TableLoadingLabel
                  maxWidth={400}
                  pr={2}
                  isLoading={isLoading}
                  render={() => (
                    <TableCellTooltip
                      renderLabel={() => <LinkButton onClick={() => {}}>{getFormattedValue(column, item)}</LinkButton>}
                      title={getFormattedValue(column, item)}
                    />
                  )}
                />
              </Grid>
            </TableCell>
          )}
          {index > 0 && (
            <TableCell role="cell">
              <TableLoadingLabel
                pr={2}
                maxWidth={190}
                render={() => getFormattedValue(column, item)}
                isLoading={isLoading}
              />
            </TableCell>
          )}
        </React.Fragment>
      ))}
    </TableRow>
  );
};

GiftBreakdownTableRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(ColumnType).isRequired,
};

export default GiftBreakdownTableRow;
