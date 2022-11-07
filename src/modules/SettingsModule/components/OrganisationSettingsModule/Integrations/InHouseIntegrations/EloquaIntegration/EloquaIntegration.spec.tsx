import React from 'react';
import { cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { Features } from '@alycecom/modules';
import { StateStatus } from '@alycecom/utils';
import { render, screen } from '../../../../../../../testUtils';

import EloquaIntegration from './EloquaIntegration';
import { organisationEloquaIntegrationInfoCheckRequest } from '../../../../../store/organisation/integrations/eloqua/eloqua.actions';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const title = 'Eloqua';

describe('EloquaIntegration', () => {
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
    const utils = render(<EloquaIntegration />, { initialState });
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

  it('does not call dispatch if FF is disabled', () => {
    setup({ [Features.FLAGS.ELOQUA_INTEGRATION]: false }, {});
    expect(dispatch).not.toBeCalledWith(organisationEloquaIntegrationInfoCheckRequest());
  });

  it('calls dispatch if FF is enabled', () => {
    setup({ [Features.FLAGS.ELOQUA_INTEGRATION]: true }, {});
    expect(dispatch).toBeCalledWith(organisationEloquaIntegrationInfoCheckRequest());
  });

  it('passes correct status to IntegrationCard if got uuid in store', () => {
    setup(
      { [Features.FLAGS.ELOQUA_INTEGRATION]: true },
      {
        organisation: {
          integrations: { eloqua: { uuid: 'some not null eloqua uuid' } },
        },
      },
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByTestId(`Integrations.${title}.CheckIcon`)).toBeInTheDocument();
  });

  it('passes correct status to IntegrationCard if got null uuid ', () => {
    setup(
      { [Features.FLAGS.ELOQUA_INTEGRATION]: true },
      {
        organisation: {
          integrations: { eloqua: { uuid: null } },
        },
      },
    );
    expect(screen.queryByTestId(`Integrations.${title}.Status`)).not.toBeInTheDocument();
  });

  it('renders no status and button if state is still pending', () => {
    setup(
      { [Features.FLAGS.ELOQUA_INTEGRATION]: true },
      {
        organisation: {
          integrations: { eloqua: { uuid: null, state: StateStatus.Pending } },
        },
      },
    );
    expect(screen.queryByTestId(`Integrations.${title}.Status`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`Integrations.${title}.ActionBtn`)).not.toBeInTheDocument();
  });
});
