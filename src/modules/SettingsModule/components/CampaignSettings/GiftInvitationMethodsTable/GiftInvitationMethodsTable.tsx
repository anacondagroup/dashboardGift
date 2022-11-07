import React, { useState, useCallback, useMemo, memo } from 'react';
import { SortDirection } from '@alycecom/utils';
import { useDispatch, useSelector } from 'react-redux';
import { findIndex, propEq, assoc, always, converge, adjust, identity, sort, prop, ascend, descend } from 'ramda';
import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  Table,
  Avatar,
  Typography,
  Link,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon, ActionButton, LoadingLabel, AlyceTheme, Tooltip } from '@alycecom/ui';
import classNames from 'classnames';

import {
  getIsLoading,
  getGiftInvitationMethods,
} from '../../../store/campaign/invitationMethods/invitationMethods.selectors';
import { IGiftInvitationMethod } from '../../../store/campaign/invitationMethods/invitationMethods.types';
import {
  getIsInvitationMethodPermitted,
  getIsVirtualInvitationMethod,
} from '../../../store/campaign/invitationMethods/invitationMethods.helpers';
import { updateGiftInvitationMethods } from '../../../store/campaign/invitationMethods/invitationMethods.actions';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  checkboxColumn: {
    width: 60,
  },
  avatar: {
    marginRight: spacing(1),
  },
  headerCell: {
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
  labelCell: {
    width: 450,
  },
}));

export interface IGiftInvitationMethodsTableProps {
  teamId?: number;
  campaignId: number;
}

const GiftInvitationMethodsTable = ({ teamId, campaignId }: IGiftInvitationMethodsTableProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoading);
  const giftInvitationMethods = useSelector(getGiftInvitationMethods);

  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.asc);
  const [localMethods, setLocalMethods] = useState(giftInvitationMethods);

  const toggleSortDirection = useCallback(
    () => setSortDirection(sortDirection === SortDirection.desc ? SortDirection.asc : SortDirection.desc),
    [sortDirection, setSortDirection],
  );

  const handleChangeMethodRestricted = useCallback(
    (id, value) => {
      const getIndex = findIndex(propEq('id', id));
      const updateItem = always(assoc('restrictedByCampaign', value));
      setLocalMethods(converge(adjust, [getIndex, updateItem, identity])(localMethods));
    },
    [localMethods, setLocalMethods],
  );

  const permittedMethods = useMemo(() => localMethods.filter(getIsInvitationMethodPermitted), [localMethods]);

  const handleSubmit = useCallback(() => {
    const restrictedMethodIds = localMethods.filter(method => method.restrictedByCampaign).map(prop('id'));
    dispatch(updateGiftInvitationMethods({ campaignId, restrictedMethodIds }));
  }, [localMethods, campaignId, dispatch]);

  const sortedMethods = useMemo(() => {
    const sortFn = sort<IGiftInvitationMethod>(
      sortDirection === SortDirection.asc ? ascend(prop('label')) : descend(prop('label')),
    );
    return sortFn(localMethods);
  }, [localMethods, sortDirection]);

  return (
    <>
      <Box width={1}>
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>
                <TableSortLabel direction={sortDirection} active onClick={toggleSortDirection}>
                  <Box pl={1.5}>name</Box>
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.headerCell}>
                <TableSortLabel hideSortIcon>
                  <Box pl={1.5}>country</Box>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMethods.map(method => {
              const methodCountries = getIsVirtualInvitationMethod(method.id) ? 'All' : 'United States, Canada';
              return (
                <TableRow key={method.id}>
                  <TableCell
                    className={classNames(classes.labelCell, {
                      'Tables-Textual-Disabled': method.restrictedByCampaign,
                      'Tables-Textual': !method.restrictedByCampaign,
                    })}
                  >
                    <Box display="flex" flexDirection="row" alignItems="center" width={1}>
                      {method.blockedByTeam ? (
                        <Box pl={1.5} pr={1.5}>
                          <Tooltip title={`${method.label} locked on the team level`}>
                            <div>
                              <Icon icon="lock-alt" />
                            </div>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Tooltip
                          title={
                            !method.allowedForCountries
                              ? 'This gift invitation method is available in US & CAN only'
                              : ''
                          }
                        >
                          <Checkbox
                            color="primary"
                            checked={!method.restrictedByCampaign}
                            disabled={
                              isLoading ||
                              (!method.restrictedByCampaign && permittedMethods.length === 1) ||
                              !method.allowedForCountries
                            }
                            onChange={() => handleChangeMethodRestricted(method.id, !method.restrictedByCampaign)}
                          />
                        </Tooltip>
                      )}
                      <Avatar className={classes.avatar} src={method.icon} />
                      {isLoading ? <LoadingLabel mt="19px" mb="19px" /> : method.label}
                    </Box>
                  </TableCell>
                  <TableCell className="Tables-Textual">
                    {isLoading ? <LoadingLabel mt="19px" mb="19px" /> : methodCountries}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Box mt={2}>
        {teamId && (
          <Typography className="Body-Regular-Left-Static">
            Want more gift invitation methods available for this campaign? You can modify the&nbsp;
            <Link
              style={{ display: 'inline' }}
              href={`/settings/teams/${teamId}/settings-and-permissions/gift-invites`}
            >
              available methods on your team settings
            </Link>
          </Typography>
        )}
      </Box>
      <Box pt={2} width={1} display="flex" justifyContent="space-between">
        <ActionButton width={100} disabled={isLoading} onClick={handleSubmit}>
          Save
        </ActionButton>
      </Box>
    </>
  );
};

export default memo<IGiftInvitationMethodsTableProps>(GiftInvitationMethodsTable);
