import { stateToUrl, urlToState } from '@alycecom/modules';

describe('Dashboard service', () => {
  describe('urlToState', () => {
    it('Should rename keys', () => {
      const actual = urlToState({
        date_range_from: '',
        date_range_to: '',
        teams_search: '',
        teams_sort: '',
        teams_direction: '',
        team_members_page: '',
        team_members_search: '',
        team_members_sort: '',
        team_members_direction: '',
        gift_sort: '',
        gift_direction: '',
        gift_search: '',
        gift_page: '',
        campaigns_search: '',
        campaigns_sort: '',
        campaigns_direction: '',
        contacts_search: '',
        contacts_sort: '',
        contacts_direction: '',
        contacts_page: '',
      });

      expect(actual).toMatchSnapshot();
    });

    describe('stateToUrl', () => {
      it('Should rename keys', () => {
        const actual = stateToUrl({
          campaignsSearch: '',
          campaignsSort: '',
          campaignsDirection: '',
          dateRangeFrom: '',
          dateRangeTo: '',
          teamsSearch: '',
          teamsSort: '',
          teamsDirection: '',
          teamMembersPage: '',
          teamMembersSearch: '',
          teamMembersSort: '',
          teamMembersDirection: '',
          giftSort: '',
          giftDirection: '',
          giftSearch: '',
          giftPage: '',
          contactsSearch: '',
          contactsSort: '',
          contactsDirection: '',
          contactsPage: '',
        });

        expect(actual).toMatchSnapshot();
      });
    });
  });
});
