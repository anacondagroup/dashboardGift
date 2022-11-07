import React, { useCallback, useEffect, useMemo } from 'react';
import { SettingsItem, Security, IDashboardAccessForm } from '@alycecom/modules';
import { Button } from '@alycecom/ui';
import { CircularProgress, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const {
  getDashboardAccess,
  getIsSecuritySettingsLoading,
  getIsSecuritySettingsLoaded,
  updateDashboardAccess,
  DashboardRestrictionPolicies,
  EdAccessFormFields,
} = Security;

const DashboardAccess = (): JSX.Element => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<IDashboardAccessForm>({
    mode: 'onChange',
    defaultValues: {
      [EdAccessFormFields.RestrictionPolicy]: DashboardRestrictionPolicies.All,
    },
  });
  const isSecuritySettingsLoading = useSelector(getIsSecuritySettingsLoading);
  const isSecuritySettingsLoaded = useSelector(getIsSecuritySettingsLoaded);
  const isDashboardAccessEnabled = useSelector(getDashboardAccess);
  const savedPermissionPolicy = useMemo(
    () => (isDashboardAccessEnabled ? DashboardRestrictionPolicies.All : DashboardRestrictionPolicies.Admins),
    [isDashboardAccessEnabled],
  );

  useEffect(() => {
    if (isSecuritySettingsLoaded) {
      reset({
        [EdAccessFormFields.RestrictionPolicy]: savedPermissionPolicy,
      });
    }
  }, [reset, isSecuritySettingsLoaded, savedPermissionPolicy]);

  const submitHandler = useCallback(
    (formValues: IDashboardAccessForm) => {
      const currentDashboardAccess = formValues[EdAccessFormFields.RestrictionPolicy];
      dispatch(updateDashboardAccess({ enabled: currentDashboardAccess === DashboardRestrictionPolicies.All }));
    },
    [dispatch],
  );

  return (
    <SettingsItem
      title="Alyce dashboard access"
      isLoading={false}
      collapsible
      description={
        <span>
          Manage which users are able to access the Alyce Dashboard. <br />
          Current access level is set to
        </span>
      }
      value={
        savedPermissionPolicy === DashboardRestrictionPolicies.All ? 'All users' : 'Only team and organizaton admins'
      }
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Controller
              name={EdAccessFormFields.RestrictionPolicy}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  aria-labelledby="restriction-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value={DashboardRestrictionPolicies.All}
                    control={<Radio color="primary" />}
                    label="All users can access the Alyce Dashboard"
                  />
                  <FormControlLabel
                    value={DashboardRestrictionPolicies.Admins}
                    control={<Radio color="primary" />}
                    label={
                      <span>
                        Only team and organization admins can access the Alyce Dashboard <br />
                        Non-admins will still have access to Alyce via integrations
                      </span>
                    }
                  />
                </RadioGroup>
              )}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!isValid || isSecuritySettingsLoading}
              startIcon={isSecuritySettingsLoading && <CircularProgress color="inherit" size={20} />}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </SettingsItem>
  );
};

export default DashboardAccess;
