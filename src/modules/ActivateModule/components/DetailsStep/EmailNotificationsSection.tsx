import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TextFieldProps,
  Theme,
} from '@mui/material';
import { Features } from '@alycecom/modules';
import { Icon } from '@alycecom/ui';
import { Control, Controller, FieldValues, Path, useWatch } from 'react-hook-form';

import { getIsPreApprovedClaimEnabled } from '../../store/steps/details';
import { NotificationStatus, NotificationStatusRecipient, ClaimType } from '../../store';
import { DetailsFormFields } from '../../store/steps/details/detailsForm.schemas';
import { useActivate } from '../../hooks/useActivate';

const styles = {
  title: {
    color: ({ palette }: Theme) => palette.text.primary,
    fontWeight: 700,
  },
} as const;

const ROWS = {
  [NotificationStatus.GiftViewed]: 'Gift viewed',
  [NotificationStatus.GiftExpired]: 'Gift expired',
  [NotificationStatus.GiftClaimedOrDeclined]: 'Gift accepted/declined',
  [NotificationStatus.ReachedClaimLimits]: 'Reached claim limits',
};

type TEmailNotificationsSectionProps<FormInterface extends FieldValues> = Omit<TextFieldProps, 'error'> & {
  control: Control<FormInterface>;
};

const EmailNotificationsSection = <FormInterface,>({
  control,
}: TEmailNotificationsSectionProps<FormInterface>): JSX.Element => {
  const isPreApprovedClaimEnabled = useSelector(getIsPreApprovedClaimEnabled);
  const isFreeClaimEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ONE_TO_MANY_FREE_CLAIMS));

  const { isBuilder } = useActivate();

  const currentClaimTypeValue = useWatch({ name: DetailsFormFields.ClaimType });

  const disabledClaimLimitsNotifications = currentClaimTypeValue === ClaimType.PreApproved;

  return (
    <>
      <Box sx={styles.title}>Gift Acceptance Notifications</Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>GIFT STATUS</TableCell>
              <TableCell>CAMPAIGN MANAGER</TableCell>
              <TableCell>ATTRIBUTED SENDER</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(ROWS).map(([type, label]) => {
              const showNotifyOwnerOption =
                type !== NotificationStatus.ReachedClaimLimits ||
                (type === NotificationStatus.ReachedClaimLimits &&
                  isFreeClaimEnabled &&
                  (!isPreApprovedClaimEnabled || isBuilder));
              const showSendAsPersonOption = type !== NotificationStatus.ReachedClaimLimits;
              const disableCheckAndShowPadlockIcon =
                disabledClaimLimitsNotifications && type === NotificationStatus.ReachedClaimLimits;

              return (
                <>
                  {showNotifyOwnerOption ? (
                    <TableRow key={type}>
                      <TableCell>{label}</TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={
                            `${DetailsFormFields.NotificationSettings}.${type}.${NotificationStatusRecipient.Owner}` as Path<
                              FormInterface
                            >
                          }
                          render={({ field: { value, onChange } }) => (
                            <Checkbox
                              color="primary"
                              disabled={disableCheckAndShowPadlockIcon}
                              icon={disableCheckAndShowPadlockIcon ? <Icon width={24} icon="lock" /> : undefined}
                              checkedIcon={disableCheckAndShowPadlockIcon ? <Icon width={24} icon="lock" /> : undefined}
                              checked={value as boolean}
                              onChange={(event, checked) => onChange(checked)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {showSendAsPersonOption && (
                          <Controller
                            control={control}
                            name={
                              `${DetailsFormFields.NotificationSettings}.${type}.${NotificationStatusRecipient.SendAs}` as Path<
                                FormInterface
                              >
                            }
                            render={({ field: { value, onChange } }) => (
                              <Checkbox
                                color="primary"
                                checked={value as boolean}
                                onChange={(event, checked) => onChange(checked)}
                              />
                            )}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EmailNotificationsSection;
