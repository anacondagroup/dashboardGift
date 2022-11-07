import React from 'react';

import ChooseCampaignOwnerSection from './ChooseCampaignOwnerSection';
import { render, screen, fireEvent } from '../../../../../../../../testUtils';
import { initialSwagTeamsState } from '../../../../../../store/campaign/swagTeams/swagTeams.reducer';
import { initialSwagTeamAdminsState } from '../../../../../../store/campaign/swagTeamAdmins/swagTeamAdmins.reducer';

const teamsMock = [
  {
    id: 1,
    name: 'Test team 1',
  },
  {
    id: 2,
    name: 'Test team 2',
  },
];

const adminsOfFirstTeamMock = [
  {
    id: 3,
    name: 'Admin 1 of first team',
  },
  {
    id: 4,
    name: 'Admin 2 of first team',
  },
  {
    id: 1122,
    name: 'Charlie Kelly',
  },
];

const adminsOfSecondTeamMock = [
  {
    id: 5,
    name: 'Admin 1 of second team',
  },
  {
    id: 6,
    name: 'Admin 2 of second team',
  },
  {
    id: 1122,
    name: 'Charlie Kelly',
  },
];

describe('Swag Campaign: ChooseCampaignOwnerSection', () => {
  const setup = (props = {}, state = {}) => {
    const utils = render(
      <ChooseCampaignOwnerSection
        isLoading={false}
        campaignId={123}
        data={{
          countryId: undefined,
          owner: undefined,
          team: undefined,
        }}
        isDraft={false}
        order={2}
        status="ACTIVE"
        title="Title"
        {...props}
      />,
      {
        initialState: {
          modules: {
            user: {
              isLoading: false,
              id: 1122,
              firstName: 'Charlie',
              lastName: 'Kelly',
            },
          },
          settings: {
            campaign: {
              swagTeams: {
                ...initialSwagTeamsState,
                teams: teamsMock,
                ...state.swagTeams,
              },
              swagTeamAdmins: {
                ...initialSwagTeamAdminsState,
                admins: adminsOfFirstTeamMock,
                ...state.swagTeamAdmins,
              },
            },
          },
        },
      },
    );

    const selectOption = (label, optionIndex) => {
      fireEvent.mouseDown(screen.getByLabelText(label));
      fireEvent.mouseDown(screen.getAllByRole('option')[optionIndex]);
    };

    return {
      ...utils,
      selectOption,
    };
  };

  describe('Team and member are not defined', () => {
    it('Should prepopulate first team if selected team is not specified', () => {
      const { getByText } = setup();
      const prepopulatedTeam = teamsMock[0];

      expect(getByText(prepopulatedTeam.name)).toBeInTheDocument();
    });

    it('Should prepopulate logged in user if selected owner is not specified', () => {
      const { getByText } = setup();
      const prepopulatedCampaignOwner = adminsOfFirstTeamMock[2];

      expect(getByText(prepopulatedCampaignOwner.name)).toBeInTheDocument();
    });

    it('Should allow to change team', () => {
      const { getByText, selectOption } = setup();

      selectOption('Select a team', 1);

      expect(getByText(teamsMock[1].name)).toBeInTheDocument();
    });

    it('Should allow to change member', () => {
      const { getByText, selectOption } = setup();

      selectOption('Select a member', 1);

      expect(getByText(adminsOfFirstTeamMock[1].name)).toBeInTheDocument();
    });
  });

  describe('Team and member are defined (Edit mode)', () => {
    let data;

    beforeEach(() => {
      data = {
        countryId: 1,
        team: {
          id: 2,
          name: 'Test team 2',
        },
        owner: {
          id: 6,
          name: 'Admin 2 of second team',
        },
      };
    });

    it('Should set passed team and member as default options', () => {
      const { getByText } = setup({ data }, { swagTeamAdmins: { admins: adminsOfSecondTeamMock } });
      const defaultTeam = teamsMock[1];
      // aka the logged in user
      const defaultMember = adminsOfSecondTeamMock[2];

      expect(getByText(defaultTeam.name)).toBeInTheDocument();
      expect(getByText(defaultMember.name)).toBeInTheDocument();
    });

    it('Should allow change team', () => {
      const { getByText, selectOption } = setup();

      selectOption('Select a team', 1);

      expect(getByText(teamsMock[1].name)).toBeInTheDocument();
    });

    it('Should allow to change member', () => {
      const { getByText, selectOption } = setup();

      selectOption('Select a member', 1);

      expect(getByText(adminsOfFirstTeamMock[1].name)).toBeInTheDocument();
    });
  });
});
