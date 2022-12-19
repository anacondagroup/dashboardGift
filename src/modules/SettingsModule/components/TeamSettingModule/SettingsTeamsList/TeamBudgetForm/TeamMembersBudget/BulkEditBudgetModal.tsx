import React, { memo, useCallback, useMemo, useState } from 'react';
import { Button } from '@alycecom/ui';
import { Box, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactNumberFormat from 'react-number-format';
import { PauseGiftingOnOption, RefreshPeriod } from '@alycecom/services';
import { EntityId } from '@alycecom/utils';
import { useSelector } from 'react-redux';

import { IUser } from '../../../../../../UsersManagement/store/usersManagement.types';
import { IBudgetUtilizationByTeam } from '../../../../../../../store/budgetUtilization/budgetUtilization.types';
import { IBudget } from '../../../../../store/teams/budgets/budgets.types';
import { makeGetSelectedUsersByTeamId } from '../../../../../store/ui/teamBudget/teamBudget.selectors';

import { styles } from './BulkEditBudgetModal.styles';

interface IBulkEditBudgetModalProps {
  selectedUserIds: EntityId[];
  teamId: number;
  budgetUtilizations: IBudgetUtilizationByTeam[];
  budget?: IBudget;
  onSaveClick: (value: number) => void;
  isOpen: boolean;
  toggleModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const PeriodDescription = {
  [RefreshPeriod.Weekly]: 'start of next week',
  [RefreshPeriod.Monthly]: 'start of next month',
  [RefreshPeriod.Quarterly]: 'start of next quarter',
  [RefreshPeriod.NoReset]: 'budget is increased',
};

const BulkEditBudgetModal = ({
  selectedUserIds,
  teamId,
  budgetUtilizations,
  budget,
  onSaveClick,
  isOpen,
  toggleModalState,
}: IBulkEditBudgetModalProps) => {
  const initialBudgetAmount = budgetUtilizations[0]?.budgetAmount ?? 1000;
  const [bulkAmount, setBulkAmount] = useState<number>(initialBudgetAmount);

  const formattedPeriod = budget ? `${budget.period[0].toUpperCase()}${budget.period.slice(1)}` : '';

  const selectedUsers = useSelector(useMemo(() => makeGetSelectedUsersByTeamId(teamId?.toString()), [teamId]));

  const insufficientAmountUsers = useMemo(
    () =>
      selectedUsers
        .filter((user: IUser) => {
          const userUtilization = budgetUtilizations.find(
            (utilization: IBudgetUtilizationByTeam) => user.id === utilization.userId,
          );
          if (!userUtilization) {
            return false;
          }
          const amountUtilized =
            userUtilization.pauseGiftingOn === PauseGiftingOnOption.Claimed
              ? userUtilization.amountClaimed
              : userUtilization.amountSent;
          return userUtilization && bulkAmount <= (amountUtilized || 0);
        })
        .map((user: IUser) => `${user.firstName} ${user.lastName}`),
    [budgetUtilizations, bulkAmount, selectedUsers],
  );

  const onSave = useCallback(() => {
    onSaveClick(bulkAmount);
    toggleModalState(false);
  }, [bulkAmount, onSaveClick, toggleModalState]);

  const insufficientUsersMessage = budget
    ? `remaining budget is insufficient with this change. Gift sending will be pause until ${
        PeriodDescription[budget.period]
      }`
    : '';

  return (
    <Modal open={isOpen} disableAutoFocus>
      <Box sx={styles.budgetAllocationModal}>
        <Box sx={styles.modalHeaderContainer}>
          <Typography sx={styles.modalHeader}>{`Edit amount for ${selectedUserIds.length} users`}</Typography>
          <CloseIcon sx={styles.closeIcon} color="action" onClick={() => toggleModalState(false)} />
        </Box>
        <Box sx={styles.content}>
          <Typography sx={styles.paragraph}>
            Define the gift budget amount each user will have available per reset period.
          </Typography>
          {!!insufficientAmountUsers.length && (
            <Box sx={styles.warning}>
              <Typography>
                <strong>Note: </strong>
                {`${insufficientAmountUsers.join(', ')} ${insufficientUsersMessage}`}
              </Typography>
            </Box>
          )}
          <Typography>{`${formattedPeriod} gift budget`}</Typography>
          <ReactNumberFormat
            onValueChange={({ floatValue }) => {
              setBulkAmount(floatValue as number);
            }}
            decimalScale={2}
            allowNegative={false}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            placeholder="$"
            InputLabelProps={{ shrink: true }}
            value={bulkAmount ?? ''}
            variant="outlined"
            inputProps={{
              min: 0,
            }}
            data-testid="TeamMembersBudget.BulkEditBudgetAmount"
          />
        </Box>
        <Box sx={styles.modalButtonContainer}>
          <Button variant="outlined" onClick={() => toggleModalState(false)}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={onSave} sx={styles.okButton}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(BulkEditBudgetModal);
