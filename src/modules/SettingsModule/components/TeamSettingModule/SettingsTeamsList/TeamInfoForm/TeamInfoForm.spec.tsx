import React from 'react';
import { Features } from '@alycecom/modules';

import { render, userEvent, screen } from '../../../../../../testUtils';

import TeamInfoForm, { ITeamInfoFormProps } from './TeamInfoForm';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('./Fields/BillingGroup', () => 'BillingGroup');

describe('TeamInfoForm', () => {
  const setup = (featuresState: Record<string, boolean>, props?: ITeamInfoFormProps) => {
    const Component = () => <TeamInfoForm {...props} />;
    const utils = render(<Component />, {
      initialState: {
        modules: {
          features: {
            features: featuresState,
          },
        },
      },
    });
    const getHeader = () => screen.getByText('Define the team name');
    const getNameField = () => screen.getByLabelText('Team name *');
    const getCancelButton = () => screen.getByRole('button', { name: /cancel/i });
    const getSaveButton = () => screen.getByRole('button', { name: /save/i });

    return {
      ...utils,
      rerender: (newProps: ITeamInfoFormProps) => utils.rerender(<TeamInfoForm {...newProps} />),
      getHeader,
      getNameField,
      getCancelButton,
      getSaveButton,
    };
  };

  it('should render with all the correct elements', () => {
    const { getHeader, getNameField, getCancelButton, getSaveButton } = setup({
      [Features.FLAGS.BUDGET_MANAGEMENT_SETUP]: false,
    });

    expect(getHeader()).toBeInTheDocument();
    expect(getNameField()).toBeInTheDocument();
    expect(getCancelButton()).toBeInTheDocument();
    expect(getSaveButton()).toBeInTheDocument();
  });

  it('should render error when attempting to submit with no name', async () => {
    const { getSaveButton, findByText } = setup({ [Features.FLAGS.BUDGET_MANAGEMENT_SETUP]: false });

    expect(getSaveButton()).toBeEnabled();

    userEvent.click(getSaveButton());

    expect(await findByText('Team name is a required field')).toBeInTheDocument();
  });

  it('should render with the teams name prepopulated when included', async () => {
    setup(
      { [Features.FLAGS.BUDGET_MANAGEMENT_SETUP]: false },
      {
        team: {
          id: 70,
          name: 'Team A',
          members: {
            amount: 1,
          },
          admins: [
            {
              full_name: 'Super Admin',
              email: 'admin@gmail.com',
              avatar: 'https://storage.googleapis.com/alyce-dev-images-data/images/users/self1045_37458.jpg',
            },
          ],
          group: {
            id: '974d5d0b-3604-463f-bcd3-3a49d2abb3d2',
            name: 'First group',
          },
        },
      },
    );

    expect(screen.getByRole('textbox', { name: /team name */i })).toHaveValue('Team A');
  });

  it('should render next button instead of save if BUDGET_MANAGEMEMENT_SETUP is enabled', () => {
    setup({ [Features.FLAGS.BUDGET_MANAGEMENT_SETUP]: true });

    const nextButton = screen.getByRole('button', { name: /next/i });
    const saveButton = screen.queryByRole('button', { name: /save/i });

    expect(saveButton).not.toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
