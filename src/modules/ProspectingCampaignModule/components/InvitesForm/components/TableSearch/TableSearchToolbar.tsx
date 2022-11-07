import React, { useEffect } from 'react';
import { Box, ButtonBase, Grid, InputAdornment, MenuItem, SxProps, TextField, Theme } from '@mui/material';
import { Button, HtmlTip, Icon } from '@alycecom/ui';
import { useModalGroupState } from '@alycecom/hooks';
import { useSelector } from 'react-redux';

import BulkActionsButton from '../BulkActionsButton/BulkActionsButton';
import {
  TBulkUpdateGiftLimitsForm,
  TBulkUpdateRemainingForm,
} from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import BulkEditModal from '../../controllers/BulkModals/BulkEditModal';
import BulkUpdateRemainingModal from '../../controllers/BulkModals/BulkUpdateRemainingModal';
import { getIsGiftLimitsBulkFulfilled } from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';

export interface ITableSearchProps {
  sx?: SxProps<Theme>;
  search: string;
  onSearchChange: (value: string) => void;
  actionsDisabled?: boolean;
  onBulkUpdate: (data: TBulkUpdateGiftLimitsForm) => void;
  onBulkSetRemaining?: (data: TBulkUpdateRemainingForm) => void;
}

enum Modals {
  BulkUpdate,
  BulkRemaining,
}

const TableSearchToolbar = ({
  sx,
  search,
  onSearchChange,
  onBulkUpdate,
  onBulkSetRemaining,
  actionsDisabled = false,
}: ITableSearchProps): JSX.Element => {
  const { opened, handleOpen, handleClose } = useModalGroupState<Modals>();
  const isBulkFulfilled = useSelector(getIsGiftLimitsBulkFulfilled);

  useEffect(() => {
    if (isBulkFulfilled) {
      handleClose();
    }
  }, [isBulkFulfilled, handleClose]);

  return (
    <>
      <Grid container spacing={2} sx={sx}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            value={search}
            onChange={event => onSearchChange(event.target.value.trimLeft())}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="search" color="grey.main" />
                </InputAdornment>
              ),
              endAdornment: !!search && (
                <InputAdornment position="end">
                  <ButtonBase onClick={() => onSearchChange('')}>
                    <Icon icon="times" color="grey.main" />
                  </ButtonBase>
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2} maxWidth={188}>
            {!onBulkSetRemaining && (
              <Button
                fullWidth
                disabled={actionsDisabled}
                size="small"
                borderColor="divider"
                onClick={() => handleOpen(Modals.BulkUpdate)}
              >
                Bulk Edit Invites
              </Button>
            )}
            {!!onBulkSetRemaining && (
              <BulkActionsButton fullWidth disabled={actionsDisabled} label="Bulk edit invites">
                <MenuItem key={0} onClick={() => handleOpen(Modals.BulkUpdate)}>
                  Edit Total/Reset Rate
                </MenuItem>
                <MenuItem key={1} onClick={() => handleOpen(Modals.BulkRemaining)}>
                  Edit Remaining
                </MenuItem>
              </BulkActionsButton>
            )}
          </Box>
        </Grid>
        <Grid item xs={8}>
          <HtmlTip
            maxWidth={800}
            height="100%"
            alignItems="center"
            startIcon={<Icon icon="graduation-cap" color="grey.main" />}
          >
            Tip: Gift limits that are set to &apos;Resets weekly&apos; will be reset on the Monday of following week.
            Gift limits that are set to ‘Resets monthly’ will reset on the first calendar day of the following month.
            Gift limits that are set to &apos;Resets quarterly&apos; will reset on the first calendar day of the new
            quarter.
          </HtmlTip>
        </Grid>
      </Grid>
      <BulkEditModal open={opened === Modals.BulkUpdate} onClose={handleClose} onSave={onBulkUpdate} />
      {!!onBulkSetRemaining && (
        <BulkUpdateRemainingModal
          open={opened === Modals.BulkRemaining}
          onClose={handleClose}
          onSave={onBulkSetRemaining}
        />
      )}
    </>
  );
};

export default TableSearchToolbar;
