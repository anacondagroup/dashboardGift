import React from 'react';
import { Features } from '@alycecom/modules';
import { useDispatch } from 'react-redux';
import { cleanup } from '@testing-library/react';
import { render } from '../../../../../testUtils';
import IntegrationsPage from './IntegrationsPage';

const mockedUseDispatch = useDispatch as jest.Mock;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('./WorkatoIntegrations/WorkatoIntegrations', () => () => 'Automations');

describe('OrganisationIntegrationsPage', () => {
  const dispatch = jest.fn();
  const setup = (featuresState: object, integrationsState?: object) => {
    const initialState = {
      modules: {
        features: {
          features: featuresState,
        },
      },
      settings: {
        organisation: {
          integrations: integrationsState || {},
        },
      },
    };
    return render(<IntegrationsPage url="some/funny/url" />, { initialState });
  };

  beforeEach(() => {
    mockedUseDispatch.mockReset();
    dispatch.mockReset();
    mockedUseDispatch.mockReturnValue(dispatch);
  });

  afterEach(cleanup);

  describe('if FF is disabled', () => {
    it('does not render hubspot integration card', () => {
      const { queryByText } = setup({ [Features.FLAGS.HUBSPOT_INTEGRATION]: false });
      expect(queryByText('HubSpot')).not.toBeInTheDocument();
    });

    it('renders eloqua integration card anyway ', () => {
      const { getByText } = setup({ [Features.FLAGS.ELOQUA_INTEGRATION]: false });
      expect(getByText('Eloqua')).toBeInTheDocument();
    });
  });

  describe('if FF is enabled', () => {
    it('renders hubspot integration card', () => {
      const { getByText } = setup({ [Features.FLAGS.HUBSPOT_INTEGRATION]: true });
      expect(getByText('HubSpot')).toBeInTheDocument();
    });

    it('renders eloqua integration card', () => {
      const { getByText } = setup({ [Features.FLAGS.ELOQUA_INTEGRATION]: true });
      expect(getByText('Eloqua')).toBeInTheDocument();
    });

    it('renders workato-based integrations if ff is enabled', () => {
      const { getByText } = setup({
        [Features.FLAGS.WORKATO_INTEGRATION]: true,
        [Features.FLAGS.PUBLIC_API]: true,
      });
      expect(getByText('Automations')).toBeInTheDocument();
    });

    it('does not render workato-based integrations if ff is disabled', () => {
      const { queryByTestId } = setup({ [Features.FLAGS.WORKATO_INTEGRATION]: false });
      expect(queryByTestId('Integrations.Workato')).not.toBeInTheDocument();
    });
  });

  describe('always renders', () => {
    it('always renders marketo integration card', () => {
      const { getByText } = setup({
        [Features.FLAGS.ELOQUA_INTEGRATION]: false,
        [Features.FLAGS.HUBSPOT_INTEGRATION]: false,
        [Features.FLAGS.SALES_FORCE_APP_ACCESS]: false,
        [Features.FLAGS.MARKETO_INTEGRATION]: false,
      });
      expect(getByText('Marketo')).toBeInTheDocument();
    });

    it('always renders salesforce integration card', () => {
      const { getByText } = setup({
        [Features.FLAGS.ELOQUA_INTEGRATION]: false,
        [Features.FLAGS.HUBSPOT_INTEGRATION]: false,
        [Features.FLAGS.SALES_FORCE_APP_ACCESS]: false,
        [Features.FLAGS.MARKETO_INTEGRATION]: false,
      });
      expect(getByText('Salesforce')).toBeInTheDocument();
    });
  });
});
