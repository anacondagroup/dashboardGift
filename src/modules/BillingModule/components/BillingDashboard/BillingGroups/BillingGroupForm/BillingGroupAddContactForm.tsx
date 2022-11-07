import React, { memo, useCallback } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { FormProvider, useForm } from 'react-hook-form';

import { TBillingGroupAddContactForm } from '../../../../store/billingGroupsContacts/billingGroupsContacts.types';
import {
  billingGroupAddContactDefaultValue,
  billingGroupAddContactResolver,
} from '../../../../store/billingGroupsContacts/billingGroupsContacts.schemas';

import BillingContactFirstName from './fields/BillingContactFirstName';
import BillingContactLastName from './fields/BillingContactLastName';
import BillingContactEmail from './fields/BillingContactEmail';

export interface IBillingGroupAddContactFormProps {
  onSave: (form: TBillingGroupAddContactForm) => void;
  onCancel: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  wrapper: {
    height: '100vh',
  },
  footer: {
    zIndex: zIndex.speedDial,
    flex: '0 0 76px',
    marginTop: spacing(4),
    padding: spacing(2, 4),
    position: 'fixed',
    bottom: 10,
    right: '1em',
  },
  cancelButton: {
    color: palette.link.main,
    marginRight: spacing(5),
  },
  titleBar: {
    background: palette.green.dark,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.125rem',
    color: palette.text.primary,
  },
  bodyText: {
    fontSize: '0.875rem',
    color: palette.text.primary,
  },
  addContact: {
    color: palette.link.main,
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'left',
    cursor: 'pointer',
  },
  addContactTitle: {
    color: palette.text.primary,
  },
  icon: {
    color: palette.link.main,
    marginRight: spacing(1),
    fontSize: '1rem',
  },
  itemsHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonIcon: {
    color: palette.link.main,
    marginRight: spacing(1),
    fontSize: '1rem',
  },
}));

const BillingGroupAddContactForm = ({ onCancel, onSave }: IBillingGroupAddContactFormProps): JSX.Element => {
  const classes = useStyles();

  const formMethods = useForm<TBillingGroupAddContactForm>({
    mode: 'all',
    defaultValues: billingGroupAddContactDefaultValue,
    resolver: billingGroupAddContactResolver,
  });
  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = formMethods;
  const isSubmitDisabled = !isValid;

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const onSubmit = useCallback(
    (form: TBillingGroupAddContactForm) => {
      onSave(form);
    },
    [onSave],
  );

  return (
    <FormProvider {...formMethods}>
      <Box ml={2} mt={2} component="form" onSubmit={handleSubmit(onSubmit)} className={classes.wrapper}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <BillingContactFirstName control={control} error={errors.firstName?.message} />
            </Grid>
            <Grid item xs={6}>
              <BillingContactLastName control={control} error={errors.lastName?.message} />
            </Grid>
            <Grid item xs={12}>
              <BillingContactEmail control={control} error={errors.email?.message} />
            </Grid>
          </Grid>
        </Box>

        <Grid container justifyContent="flex-end">
          <Box mt={3}>
            <Box className={classes.footer}>
              <Button
                onClick={handleCancel}
                variant="outlined"
                className={classes.cancelButton}
                data-testid="BillingInsight.BillingGroup.AddContactCancel"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                data-testid="BillingInsight.BillingGroup.AddContactSave"
                disabled={isSubmitDisabled}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Box>
    </FormProvider>
  );
};

export default memo(BillingGroupAddContactForm);
