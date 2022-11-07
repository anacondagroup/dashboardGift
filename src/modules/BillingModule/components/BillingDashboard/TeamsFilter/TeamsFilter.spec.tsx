/* eslint-disable testing-library/no-node-access */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../../../testUtils';
import { initialState as orgState } from '../../../store/customerOrg/customerOrg.reducer';
import { setTeamsFilter } from '../../../store/customerOrg';

import TeamsFilter from './TeamsFilter';

describe('TeamsFilter', () => {
  const setup = () =>
    render(<TeamsFilter />, {
      initialState: {
        billing: {
          customerOrg: {
            ...orgState,
            teams: {
              ...orgState.teams,
              list: [
                {
                  teamId: 0,
                  teamName: 'Team 0',
                },
                {
                  teamId: 1,
                  teamName: 'Team 1',
                  groupId: 'g0',
                },
              ],
            },
            groups: {
              ...orgState.groups,
              list: [
                {
                  groupId: 'g0',
                  groupName: 'Group 0',
                },
                {
                  groupId: 'g1',
                  groupName: 'Group 1',
                },
              ],
            },
          },
        },
      },
    });

  test('Should set filter by team when clicked on team', async () => {
    const { dispatch } = setup();

    userEvent.click(screen.getByTestId('BillingInsight.FiltersDropdown').children[0]);
    await screen.findByTestId('BillingInsight.FiltersDropdown.1');
    userEvent.click(screen.getByTestId('BillingInsight.FiltersDropdown.1').children[0]);

    expect(dispatch).toBeCalledWith(setTeamsFilter({ teamIds: [1], groupIds: ['g0'] }));
  });

  test('Should set filter by group when clicked on group', async () => {
    const { dispatch } = setup();

    userEvent.click(screen.getByTestId('BillingInsight.FiltersDropdown').children[0]);
    await screen.findByTestId('BillingInsight.FiltersDropdown.g0');
    userEvent.click(screen.getByTestId('BillingInsight.FiltersDropdown.g0').children[0]);

    expect(dispatch).toBeCalledWith(setTeamsFilter({ teamIds: [], groupIds: ['g0'] }));
  });
});
