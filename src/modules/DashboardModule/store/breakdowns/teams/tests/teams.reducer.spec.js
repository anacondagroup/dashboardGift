import { reducer, initialState } from '../teams.reducer';
import { teamsLoadSuccess } from '../teams.actions';

describe('teams reducer', () => {
  describe('teamsLoadSuccess', () => {
    it('Should transform breakdown data to app format', () => {
      const actual = reducer(
        initialState,
        teamsLoadSuccess([
          {
            id: 1,
            name: 'WEX',
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
