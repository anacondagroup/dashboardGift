import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HtmlTip, ActionButton, BaseField } from '@alycecom/ui';
import { SettingsItem, Security } from '@alycecom/modules';

const { updateDomainsRequest, getAllowedDomains, getIsSecuritySettingsLoading } = Security;

interface IDomainsForm {
  domains: string;
}

const DOMAIN_PATTERN = /^(?=^.{1,253}$)(([a-z\d]([a-z\d-]{0,62}[a-z\d])*[.]){1,3}[a-z]{1,61})$/gm;

const schema = object().shape({
  domains: string()
    .trim()
    .test('domainValidation', 'Please, enter valid domains', value =>
      value
        ? value
            .split(',')
            .map(v => v.trim())
            .every(domain => domain.match(DOMAIN_PATTERN))
        : true,
    ),
});

const DomainRestrictionsSetting = (): React.ReactElement => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<IDomainsForm>({
    resolver: yupResolver(schema),
  });
  const domainsField = register('domains');

  const dispatch = useDispatch();
  const storeDomains = useSelector(getAllowedDomains);
  const hasPendingRequest = useSelector(getIsSecuritySettingsLoading);

  const saveDomains = useCallback(
    ({ domains }: IDomainsForm) => {
      const domainsArr = domains ? domains.split(',').map(v => v.trim()) : [];
      dispatch(updateDomainsRequest(domainsArr));
    },
    [dispatch],
  );

  return (
    <SettingsItem
      isLoading={false}
      collapsible
      title="Domain restrictions"
      description={
        storeDomains ? `Currently access is only allowed to` : `Currently no domain limitations are applied.`
      }
      value={storeDomains}
    >
      <Box mt={2}>
        Limit platform access to specific domains, meaning users can only sign in with associated domains.
      </Box>
      <Box mb={3} fontStyle="italic">
        This limits the team admin’s ability to give access to members outside of specific domains.
      </Box>
      <Box mt={2} mr={1} display="flex" justifyContent="space-between" alignItems="center">
        <BaseField
          inputRef={domainsField.ref}
          {...domainsField}
          defaultValue={storeDomains}
          variant="outlined"
          fullWidth
          label="Leave blank to allow all"
          placeholder="gmail.com, outlook.com"
          error={!!errors.domains}
          helperText={errors.domains && errors.domains.message}
        />
        <Box ml={1}>
          <ActionButton disabled={!!errors.domains || hasPendingRequest} onClick={handleSubmit(saveDomains)}>
            Apply
          </ActionButton>
        </Box>
      </Box>
      <HtmlTip mt={2} mr={1}>
        <Typography>
          1. This will affect the integration with email and calendar as well. Make sure to add all email and calendar
          domains.
          <br />
          2. The users outside of these domains won&apos;t be able to log into the system.
          <br />
          3. If users are currently logged in, they will not be logged out with these changes.
          <br />
          4. All currently integrated email/calendar accounts will keep functioning until integration is disabled.
        </Typography>
      </HtmlTip>
    </SettingsItem>
  );
};

export default DomainRestrictionsSetting;
