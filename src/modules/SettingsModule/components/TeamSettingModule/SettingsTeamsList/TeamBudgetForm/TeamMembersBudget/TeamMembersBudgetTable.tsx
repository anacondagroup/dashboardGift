import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableCellTooltip } from '@alycecom/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Checkbox,
  Box,
  Avatar,
  Typography,
  Skeleton,
  TableCellProps,
  TableSortLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';
import ReactNumberFormat from 'react-number-format';
import { Control, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  BudgetCreateField,
  ITeamMemberBudget,
  PauseGiftingOnOption,
  RefreshPeriod,
  TBudgetCreateParams,
} from '@alycecom/services';
import { NumberFormat } from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';

import { IUser } from '../../../../../../UsersManagement/store/usersManagement.types';
import { IBudget } from '../../../../../store/teams/budgets/budgets.types';
import BulkEdit from '../fields/BulkEdit';
import {
  BudgetBulkEditOption,
  IBudgetUtilizationByTeam,
} from '../../../../../../../store/budgetUtilization/budgetUtilization.types';
import { toggleAllUsersSelection, toggleUserSelection } from '../../../../../store/ui/teamBudget/teamBudget.reducer';
import { getIsAllUsersSelected, getSelectedUsersIds } from '../../../../../store/ui/teamBudget/teamBudget.selectors';

import BulkEditBudgetModal from './BulkEditBudgetModal';
import { styles } from './TeamMembersBudgetTable.styles';

interface ICustomTableCellProps extends TableCellProps {
  isLoading?: boolean;
  testId?: string;
}

const CustomTableCell = ({ children, testId, ...props }: ICustomTableCellProps): JSX.Element => (
  <TableCell sx={styles.tableCell} size="small" {...props}>
    <Box data-testid={testId} sx={styles.tableCellBox}>
      {children}
    </Box>
  </TableCell>
);

const PauseGiftingOnIndex = {
  [PauseGiftingOnOption.Claimed]: 'amountClaimed',
  [PauseGiftingOnOption.Sent]: 'amountSent',
};

export interface ITeamMembersBudgetTableProps {
  users: IUser[];
  teamId: number;
  teamMembersHaveLoaded: boolean;
  control: Control<TBudgetCreateParams>;
  refreshPeriod: RefreshPeriod;
  teamUtilizations: IBudgetUtilizationByTeam[];
  onMemberBudgetDefinition: () => void;
  existingBudget?: IBudget;
  pauseGiftingOn: PauseGiftingOnOption;
}

const CustomTextInput = (props: TextFieldProps) => <TextField {...props} sx={styles.budgetField} />;

const TeamMembersBudgetTable = ({
  users,
  teamId,
  teamMembersHaveLoaded,
  control,
  refreshPeriod,
  teamUtilizations,
  onMemberBudgetDefinition,
  existingBudget,
  pauseGiftingOn,
}: ITeamMembersBudgetTableProps): JSX.Element => {
  const dispatch = useDispatch();

  const { fields, append } = useFieldArray({
    name: BudgetCreateField.TeamMemberBudgets,
    control,
  });

  const { setValue, getValues } = useFormContext();

  const isAllUsersSelected = useSelector(getIsAllUsersSelected);
  const selectedUsersIds = useSelector(getSelectedUsersIds);

  const [showBulkEditModal, toggleBulkEditModalState] = useState<boolean>(false);

  useEffect(() => {
    // For initialCreation
    if (!existingBudget) {
      users.forEach(user => {
        const hasExistingMemberBudgetField = fields.find(field => field.userId === user.id);
        if (!hasExistingMemberBudgetField) append({ userId: user.id, budget: 0 });
      });
    }
  }, [existingBudget, append, fields, users]);

  useEffect(() => {
    if (existingBudget && teamMembersHaveLoaded) {
      users.forEach(user => {
        const hasExistingMemberBudget = existingBudget.teamMembers.find(
          memberBudget => memberBudget.userId === user.id,
        );
        const hasExistingMemberBudgetField = fields.find(field => field.userId === user.id);

        if (!hasExistingMemberBudget && !hasExistingMemberBudgetField) {
          append({ userId: user.id, budget: 0 });
        }
      });
    }
  }, [users, append, fields, existingBudget, teamMembersHaveLoaded]);

  const skeletonLoading = React.useCallback(
    () =>
      Array.from(Array(4).keys()).map((item: number) => (
        <CustomTableCell key={item}>
          <Skeleton width="100%" sx={styles.skeletonContainer} />
        </CustomTableCell>
      )),
    [],
  );

  const handleSelectAll = useCallback(
    (checked: Boolean) => {
      const userIds = users.map(user => user.id);
      dispatch(toggleAllUsersSelection({ users: userIds as EntityId[], checked }));
    },
    [dispatch, users],
  );

  const handleSelectUser = useCallback(
    (user: IUser, checked: Boolean) => {
      dispatch(toggleUserSelection({ user: user.id as EntityId, checked, totalUsers: users.length }));
    },
    [users, dispatch],
  );

  const getIsUserSelected = useCallback(
    (userId: EntityId) => selectedUsersIds.some((selectedUser: EntityId) => selectedUser === userId),
    [selectedUsersIds],
  );

  const onBulkEditChange = useCallback((option: string) => {
    if (option === BudgetBulkEditOption.GiftBudget) {
      toggleBulkEditModalState(true);
    }
  }, []);

  const onBulkEditSaveClick = useCallback(
    (newBudget: number) => {
      const teamMemberBudgets = getValues(BudgetCreateField.TeamMemberBudgets);
      const newValues = teamMemberBudgets.map((teamMemberBudget: ITeamMemberBudget) => {
        if (selectedUsersIds.find((user: EntityId) => Number(user) === teamMemberBudget.userId)) {
          return {
            ...teamMemberBudget,
            budget: newBudget,
          };
        }
        return teamMemberBudget;
      });
      setValue(BudgetCreateField.TeamMemberBudgets, newValues);
    },
    [setValue, selectedUsersIds, getValues],
  );

  return (
    <>
      <BulkEditBudgetModal
        selectedUserIds={selectedUsersIds}
        teamId={teamId}
        budgetUtilizations={teamUtilizations}
        budget={existingBudget}
        onSaveClick={onBulkEditSaveClick}
        isOpen={showBulkEditModal}
        toggleModalState={toggleBulkEditModalState}
      />
      <TableContainer sx={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead data-testid="TeamMembersBudgetTable.Head">
            <TableRow>
              <CustomTableCell>
                <Checkbox
                  color="primary"
                  checked={isAllUsersSelected}
                  onChange={() => handleSelectAll(isAllUsersSelected)}
                  data-testid="TeamMembersBudgetTable.UserSelect.SelectAll"
                />
              </CustomTableCell>
              <CustomTableCell>
                {!!selectedUsersIds?.length && <BulkEdit onChange={onBulkEditChange} />}
                {!selectedUsersIds?.length && (
                  <TableSortLabel
                  // TODO: Fix/restore sorting w/ PD-12177
                  // https://alycecom.atlassian.net/browse/PD-12177
                  // direction={sortDirection}
                  // active={sortField === 'name'}
                  // onClick={() => onSortChange('name')}
                  >
                    <Typography sx={styles.headerTitle}>NAME</Typography>
                  </TableSortLabel>
                )}
              </CustomTableCell>
              <CustomTableCell>
                <Typography sx={styles.headerTitle}>GIFT BUDGET / RESET</Typography>
              </CustomTableCell>
              <CustomTableCell>
                <Typography sx={styles.headerTitle}>UTILIZED THIS PERIOD</Typography>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!teamMembersHaveLoaded ? (
              <TableRow data-testid="TeamMembersBudget.TableLoading">{skeletonLoading()}</TableRow>
            ) : (
              fields.map((field, index) => {
                const userForField: IUser | undefined = users.find(user => user.id === field.userId);
                const userUtilization = teamUtilizations.find(
                  utilization => userForField && utilization.userId === userForField.id,
                );
                const userUtilizationValue = userUtilization
                  ? userUtilization[PauseGiftingOnIndex[pauseGiftingOn] as keyof typeof userUtilization]
                  : 0;

                return userForField ? (
                  <TableRow key={field.id}>
                    <CustomTableCell>
                      <Checkbox
                        color="primary"
                        checked={getIsUserSelected(userForField.id)}
                        onChange={() => handleSelectUser(userForField, getIsUserSelected(userForField.id))}
                        data-testid="TeamMembersBudgetTable.UserSelect.SelectAll"
                      />
                    </CustomTableCell>
                    <CustomTableCell>
                      <Box sx={styles.avatarContainer}>
                        <Avatar src={userForField.imageUrl} sizes="30" />
                        <Box sx={styles.userContainer}>
                          <TableCellTooltip
                            data-testid={`TeamMembersBudget.Table.${index}.Name`}
                            title={`${userForField.firstName} ${userForField.lastName} `}
                            lengthToShow={10}
                            placement="top-start"
                          />
                        </Box>
                      </Box>
                    </CustomTableCell>
                    <CustomTableCell>
                      <Box sx={styles.budgetAndRefreshContainer}>
                        <Controller
                          control={control}
                          name={`${BudgetCreateField.TeamMemberBudgets}.${index}.budget` as const}
                          render={({ field: { onChange, value } }) => (
                            <ReactNumberFormat
                              style={styles.budgetField as React.CSSProperties}
                              key={field.userId}
                              onValueChange={({ floatValue }) => {
                                onChange(floatValue ?? 0);
                                onMemberBudgetDefinition();
                              }}
                              decimalScale={2}
                              allowNegative={false}
                              customInput={CustomTextInput}
                              disabled={false}
                              thousandSeparator
                              prefix="$"
                              placeholder="$"
                              InputLabelProps={{ shrink: true }}
                              value={value ?? ''}
                              variant="outlined"
                              inputProps={{
                                min: 0,
                                styles: [styles.tableParameter],
                                'data-testid': 'TeamMembersBudget.TeamMemberBudget',
                              }}
                            />
                          )}
                        />
                        <Typography sx={styles.tableParameter}> / {refreshPeriod}</Typography>
                      </Box>
                    </CustomTableCell>
                    <TableCell sx={styles.utilizationContainer}>
                      <NumberFormat format="$0,0.00">{userUtilizationValue}</NumberFormat>
                    </TableCell>
                  </TableRow>
                ) : null;
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default TeamMembersBudgetTable;
