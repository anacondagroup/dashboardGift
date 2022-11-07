import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsItem } from '@alycecom/modules';

import OrganisationName from '../OrganisationName/OrganisationName';
import OrganisationAvatar from '../OrganisationAvatar/OrganisationAvatar';
import { organisationSettingsUpdateNameRequest } from '../../../../store/organisation/general/organisationGeneral.actions';
import {
  getSettings,
  getIsLoading,
  getErrors,
} from '../../../../store/organisation/general/organisationGeneral.selectors';
import BrandingSettings from '../../../BrandingSettings/BrandingSettings';
import {
  getIsLoading as getIsBrandingLoading,
  getBrandingOwner,
} from '../../../../store/organisation/branding/branding.selectors';
import { loadBrandingRequest } from '../../../../store/organisation/branding/branding.actions';
import { DEFAULT_ORGANIZATION_AVATAR } from '../../../../store/organisation/general/organisationGeneral.constants';

const OrganizationSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);
  const isLoading = useSelector(getIsLoading);
  const errors = useSelector(getErrors);

  const isBrandingLoading = useSelector(getIsBrandingLoading);
  const brandingOwner = useSelector(getBrandingOwner);

  const handleOrgNameSave = useCallback(
    name => {
      dispatch(organisationSettingsUpdateNameRequest(name));
    },
    [dispatch],
  );

  const handleChangeStyling = useCallback(() => {
    dispatch(loadBrandingRequest({ showBranding: true }));
  }, [dispatch]);

  return (
    <>
      <OrganisationAvatar
        image={settings?.image_url ?? DEFAULT_ORGANIZATION_AVATAR}
        isLoading={isLoading}
        alt="Organization logo"
      />
      <SettingsItem
        title="Organization Name"
        description="This is how your organization’s name will be displayed across site, emails, etc. Your organization name is currently set to"
        isLoading={isLoading}
        value={settings?.name ?? ''}
      >
        <OrganisationName
          name={settings?.name ?? ''}
          isLoading={isLoading}
          errors={errors}
          onSubmit={handleOrgNameSave}
        />
      </SettingsItem>
      <BrandingSettings
        title="Gift Redemption Page Branding"
        description="Apply custom branding to all gift redemption pages for your organization (unless otherwise customized for a given team or campaign)"
        isLoading={isBrandingLoading}
        onChange={handleChangeStyling}
        brandingOwner={brandingOwner}
      />
    </>
  );
};

export default OrganizationSettings;
