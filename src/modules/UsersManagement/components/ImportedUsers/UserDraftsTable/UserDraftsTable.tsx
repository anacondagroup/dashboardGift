import React, { useCallback, memo } from 'react';
import { FormHelperText, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, VirtualizedTable } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'react-virtualized';
import { User } from '@alycecom/modules';

import { getUserDrafts } from '../../../store/entities/userDrafts';
import UserInfo from '../../UserInfo/UserInfo';
import { deleteUserDraftById } from '../../../store/entities/userDrafts/userDrafts.actions';
import { IUserDraft } from '../../../store/entities/userDrafts/userDrafts.types';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  button: {
    width: 90,
    height: 40,
    marginRight: spacing(1),
    color: palette.error.main,
    borderColor: palette.error.main,
  },
  table: {
    width: '100%',
    margin: 0,
    '& .ReactVirtualized__Table__rowColumn': {
      justifyContent: 'flex-start',
    },
    '& .ReactVirtualized__Table__headerRow': {
      width: '100% !important',
    },
    '& .ReactVirtualized__Table__row': {
      width: '100% !important',
      borderBottom: `solid 1px ${palette.divider}`,
    },
    '& .ReactVirtualized__Table__row:last-child': {
      borderBottom: 'none',
    },
    '& .ReactVirtualized__Table__rowColumn[aria-colindex="1"]': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    '& .ReactVirtualized__Table__rowColumn[aria-colindex="2"]': {
      justifyContent: 'flex-end',
    },
    '& .ReactVirtualized__Table__Grid': {
      width: '100% !important',
      paddingTop: 0,
    },
  },
  errorText: {
    width: '100%',
  },
}));

const UserDraftsTable = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userDrafts = useSelector(getUserDrafts);
  const getUserDraftRow = useCallback(({ index }) => userDrafts[index], [userDrafts]);

  const orgName = useSelector(User.selectors.getOrgName);

  const hasUserDrafts = userDrafts.length > 0;

  const handleRemoveUserDraft = useCallback(id => dispatch(deleteUserDraftById(id)), [dispatch]);

  const renderError = useCallback(
    (rowData: IUserDraft) => {
      if (rowData.isDuplicated || rowData.hasTeam) {
        return (
          <FormHelperText error classes={{ root: classes.errorText }}>
            User with the same email exists already
          </FormHelperText>
        );
      }
      if (!rowData.isWhitelistedDomain) {
        return (
          <FormHelperText error classes={{ root: classes.errorText }}>
            The domain {rowData.email.split('@')[1]} is restricted for {orgName} account
          </FormHelperText>
        );
      }
      return null;
    },
    [orgName, classes],
  );

  const renderNameColumn = useCallback(
    ({ rowData }) => (
      <>
        <UserInfo user={rowData} size="sm" />
        {renderError(rowData)}
      </>
    ),
    [renderError],
  );

  const renderActionColumn = useCallback(
    ({ rowData }) =>
      (rowData.isDuplicated || rowData.hasTeam || !rowData.isWhitelistedDomain) && (
        <Button className={classes.button} variant="outlined" onClick={() => handleRemoveUserDraft(rowData.id)}>
          Remove
        </Button>
      ),
    [handleRemoveUserDraft, classes],
  );

  const emptyRowsRenderer = useCallback(
    () => (
      <Box mt={3}>
        <Typography className="Body-Regular-Center-Chambray">No imported users</Typography>
      </Box>
    ),
    [],
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
      <VirtualizedTable
        className={classes.table}
        rowHeight={84}
        headerHeight={24}
        height={hasUserDrafts ? 540 : 100}
        rowCount={userDrafts.length}
        rowGetter={getUserDraftRow}
        noRowsRenderer={emptyRowsRenderer}
      >
        <Column label="Name" dataKey="label" width={350} cellRenderer={renderNameColumn} disableSort />
        <Column dataKey="Action" width={180} cellRenderer={renderActionColumn} disableSort />
      </VirtualizedTable>
    </Box>
  );
};

export default memo(UserDraftsTable);
