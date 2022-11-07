import { reducer, initialState } from '../teamMembers.reducer';
import { teamMembersLoadSuccess } from '../teamMembers.actions';

describe('team members reducer', () => {
  describe('teamsLoadSuccess', () => {
    it('Should transform breakdown data to app format', () => {
      const actual = reducer(
        initialState,
        teamMembersLoadSuccess([
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u2_33201.jpg',
            id: 2,
            first_name: 'Greg',
            last_name: 'Segall',
            gifts_sent: 0,
            gifts_viewed: 0,
            gifts_accepted: 0,
            meetings_booked: 0,
          },
          {
            avatar: 'http://alyce.site/images/avatar.png',
            id: 13,
            first_name: 'Valentin',
            last_name: 'Belorustcev',
            gifts_sent: 0,
            gifts_viewed: 0,
            gifts_accepted: 0,
            meetings_booked: 0,
          },
        ]),
      );

      expect(actual).toMatchSnapshot();
    });
  });
});
