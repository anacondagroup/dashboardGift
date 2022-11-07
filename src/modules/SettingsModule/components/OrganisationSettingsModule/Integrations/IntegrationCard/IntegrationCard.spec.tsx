import React from 'react';
import { cleanup } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_ATTENTION,
  INTEGRATION_STATUS_CONNECTED,
  INTEGRATION_STATUS_ERROR,
  INTEGRATION_STATUS_INACTIVE,
  INTEGRATION_STATUS_LOCKED,
} from '../../../../constants/organizationSettings.constants';
import { render, screen } from '../../../../../../testUtils';
import { IIntegrationCardProps, IntegrationCard } from './IntegrationCard';

describe('OrganisationIntegrationItem', () => {
  const basicProps: IIntegrationCardProps = {
    title: 'HubSpot',
    logoSrc: 'someSrcToImg',
    status: 'inactive',
    isLoading: false,
    shouldGoToMarketplace: false,
    description: 'Some description',
    troubleshootingLink: 'Some link',
    open: jest.fn(),
  };

  const { title, description, logoSrc } = basicProps;
  describe('IntegrationCard basic', () => {
    const setup = (overrideProps?: object) =>
      render(<IntegrationCard {...{ ...basicProps, ...overrideProps }} />, { initialState: {} });

    describe('tests with basic props', () => {
      beforeEach(() => {
        setup();
      });

      afterEach(cleanup);

      it('renders integration title', () => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });

      it('must have src and alt', () => {
        expect(screen.getByRole('img')).toHaveAttribute('src', logoSrc);
        expect(screen.getByRole('img')).toHaveAttribute('alt', title);
      });

      it('renders correct description', () => {
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    });

    it('renders learn more block when required', () => {
      setup({
        status: INTEGRATION_STATUS_ERROR,
        troubleshootingLink: 'Some link',
      });
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('calls open integration function when clicked', () => {
      const open = jest.fn();
      setup({ open });
      userEvent.click(screen.getByTestId(`Integrations.${title}.ActionBtn`));
      expect(open).toBeCalled();
    });

    it('renders correct locked status and label', () => {
      setup({ status: INTEGRATION_STATUS_LOCKED });
      expect(screen.getByText('Locked')).toBeInTheDocument();
      expect(screen.getByTestId(`Integrations.${title}.LockIcon`)).toBeInTheDocument();
    });

    it('renders correct attention status and label', () => {
      setup({ status: INTEGRATION_STATUS_ATTENTION });
      expect(screen.getByText('Attention required')).toBeInTheDocument();
      expect(screen.getByTestId(`Integrations.${title}.ExclamationTriangleIcon`)).toBeInTheDocument();
    });

    it('renders correct connected status and label', () => {
      setup({ status: INTEGRATION_STATUS_CONNECTED });
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByTestId(`Integrations.${title}.CheckIcon`)).toBeInTheDocument();
    });

    it('does not render Manage button when needed', () => {
      setup({
        status: null,
      });
      expect(screen.queryByText('Manage')).not.toBeInTheDocument();
    });

    describe('actionLabel', () => {
      it('renders go to marketplace when there is shouldGoToMarketplace===true prop ', () => {
        setup({
          shouldGoToMarketplace: true,
        });
        expect(screen.getByText(`Go To ${title} Marketplace`)).toBeInTheDocument();
      });
      it('renders Manage button when needed', () => {
        setup({
          status: INTEGRATION_STATUS_ACTIVE,
        });
        expect(screen.getByText('Manage')).toBeInTheDocument();
      });

      it('renders correct error status and label', () => {
        setup({
          status: INTEGRATION_STATUS_ERROR,
        });
        expect(screen.getByText('Disconnected')).toBeInTheDocument();
        expect(screen.getByTestId(`Integrations.${title}.TimesIcon`)).toBeInTheDocument();
      });

      it('renders correct inactive status and label', () => {
        setup({
          status: INTEGRATION_STATUS_INACTIVE,
        });
        expect(screen.getByText('Disconnected')).toBeInTheDocument();
        expect(screen.getByTestId(`Integrations.${title}.TimesIcon`)).toBeInTheDocument();
      });

      it('renders correct active status and label', () => {
        setup({
          status: INTEGRATION_STATUS_ACTIVE,
        });
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByTestId(`Integrations.${title}.CheckIcon`)).toBeInTheDocument();
      });
    });
  });
});
