import React from 'react';
import { cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { Features } from '@alycecom/modules';
import { StateStatus } from '@alycecom/utils';
import { render, screen } from '../../../../../../../testUtils';
import HubspotIntegration from './HubspotIntegration';
import { organisationHubspotIntegrationStatusCheckRequest } from '../../../../../store/organisation/integrations/hubspot/hubspot.actions';
import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_INACTIVE,
} from '../../../../../constants/organizationSettings.constants';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const title = 'HubSpot';

describe('HubspotIntegration', () => {
  const dispatch = jest.fn();

  const setup = (featuresState: object, integrationState: object) => {
    const initialState = {
      settings: integrationState,
      modules: {
        features: {
          features: featuresState,
        },
      },
    };
    const utils = render(<HubspotIntegration />, { initialState });
    return { utils, initialState };
  };

  beforeEach(() => {
    // @ts-ignore
    useDispatch.mockReset();
    dispatch.mockReset();
    // @ts-ignore
    useDispatch.mockReturnValue(dispatch);
  });

  afterEach(cleanup);

  it('never calls dispatch if FF is disabled', () => {
    setup({ [Features.FLAGS.HUBSPOT_INTEGRATION]: false }, {});
    expect(dispatch).not.toBeCalledWith(organisationHubspotIntegrationStatusCheckRequest());
  });

  it('calls dispatch if FF is enabled', () => {
    setup({ [Features.FLAGS.HUBSPOT_INTEGRATION]: true }, {});
    expect(dispatch).toBeCalledWith(organisationHubspotIntegrationStatusCheckRequest());
  });

  it(`passes correct status to OrganisationIntegrationItem if got ${INTEGRATION_STATUS_ACTIVE}`, () => {
    setup(
      { [Features.FLAGS.HUBSPOT_INTEGRATION]: true },
      {
        organisation: {
          integrations: { hubspot: { status: INTEGRATION_STATUS_ACTIVE, state: StateStatus.Fulfilled } },
        },
      },
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByTestId(`Integrations.${title}.CheckIcon`)).toBeInTheDocument();
  });

  it(`passes correct status to OrganisationIntegrationItem if got ${INTEGRATION_STATUS_INACTIVE}`, () => {
    setup(
      { [Features.FLAGS.HUBSPOT_INTEGRATION]: true },
      {
        organisation: {
          integrations: { hubspot: { status: INTEGRATION_STATUS_INACTIVE, state: StateStatus.Fulfilled } },
        },
      },
    );

    expect(screen.queryByTestId(`Integrations.${title}.Status`)).not.toBeInTheDocument();
  });

  it('renders no status and button if state is still pending', () => {
    setup(
      { [Features.FLAGS.HUBSPOT_INTEGRATION]: true },
      {
        organisation: {
          integrations: { hubspot: { status: null, state: StateStatus.Pending } },
        },
      },
    );

    expect(screen.queryByTestId(`Integrations.${title}.Status`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`Integrations.${title}.ActionBtn`)).not.toBeInTheDocument();
  });
});
