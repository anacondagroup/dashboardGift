import { reducer, initialState } from '../profile.reducer';
import { profileLoadSuccess } from '../profile.actions';

describe('Profile reducer', () => {
  describe('load success', () => {
    it('Should rename keys', () => {
      const actual = reducer(
        initialState,
        profileLoadSuccess({
          contact: {
            id: 1429,
            email: 'barr_tim@grandhotels.com',
            firstName: 'Bler',
            lastName: 'Barr',
            fullName: 'Bler Barr',
            isUnsubscribed: false,
            phone: '',
            discoveryNotes: '',
            countryId: 1,
            position: 'SVP, Administration and Finance, Grand Hotels & Resorts Ltd',
            research: {
              company: 'Cmp Ltd.',
              image: 'http://alyce.site/images/avatar.png',
              education: '',
              location: 'US asa 123 US',
              researchTags: [],
            },
          },
          latestGift: null,
          currentGift: null,
          statistic: {
            created: 0,
            sent: 0,
            accepted: 0,
            meetings: 0,
          },
        }),
      );

      expect(actual).toMatchSnapshot();
    });
  });
});
