import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, fireEvent, waitFor, screen } from '../../../../../../../../testUtils';

import ChooseCampaignOwnerSection from './ChooseCampaignOwnerSection';

describe.skip('ChooseCampaignOwnerSection', () => {
  const setup = (props, state) => {
    const initialState = {
      settings: {
        campaign: {
          batchOwners: {
            members: [
              {
                id: 100,
                name: 'Batch owner',
                avatar: 'batchOwner.png',
              },
            ],
            isLoading: false,
          },
        },
      },
      ...state,
    };
    const utils = render(
      <ChooseCampaignOwnerSection
        title="Title"
        status="ACTIVE"
        order={1}
        campaignId={1}
        teamId={11}
        isLoading={false}
        {...props}
      />,
      {
        initialState,
      },
    );

    const getBatchOwnerField = () => screen.getByRole('textbox');
    const getSelectMemberField = () => screen.getByRole('button', { name: /Select a member/i });

    return {
      ...utils,
      getBatchOwnerField,
      getSelectMemberField,
    };
  };

  it('Should render without errors', () => {
    setup();
  });

  it('Should display required error messages once fields have been touched', async () => {
    const { getByRole, getAllByRole, getBatchOwnerField, getSelectMemberField } = setup();
    const submitButton = getByRole('button', { name: /Next step/i });

    await waitFor(() => expect(submitButton).toBeDisabled());

    userEvent.click(getSelectMemberField());
    userEvent.click(getAllByRole('option')[0]);

    userEvent.type(getBatchOwnerField(), 'owner');

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('Should not display errors if fields are valid', async () => {
    const { findByText, getBatchOwnerField, getSelectMemberField } = setup();

    fireEvent.blur(getBatchOwnerField());
    fireEvent.blur(getSelectMemberField());

    expect(await findByText('Member is required')).toBeInTheDocument();
    expect(await findByText('Batch name is required')).toBeInTheDocument();
  });

  it('Should trim left spaces on each change event', () => {
    const { getBatchOwnerField } = setup();
    const batchOwnerField = getBatchOwnerField();

    userEvent.type(batchOwnerField, '   ow');

    expect(batchOwnerField).toHaveValue('ow');
  });

  it('Should trim right spaces once field loses focus', () => {
    const { getBatchOwnerField } = setup();
    const batchOwnerField = getBatchOwnerField();

    userEvent.type(batchOwnerField, 'ow    ');
    fireEvent.blur(batchOwnerField);

    expect(batchOwnerField).toHaveValue('ow');
  });

  it('Should display min error message if typed name is less than 3 characters', async () => {
    const { findByText, getBatchOwnerField } = setup();

    userEvent.type(getBatchOwnerField(), 'ow');

    expect(await findByText('The batch name should be longer than 3 characters')).toBeInTheDocument();
  });

  it('Should display max error message if typed name is greater than 50 characters', async () => {
    const { getBatchOwnerField, findByText } = setup();
    const fiftyOneCharacter = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcv51';

    userEvent.type(getBatchOwnerField(), fiftyOneCharacter);

    expect(await findByText('The batch name should not exceed 50 characters')).toBeInTheDocument();
  });
});
