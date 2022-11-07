import { getContactCountryId } from '../contact.selectors';

describe('contact selectors', () => {
  describe('getContactCountryId', () => {
    it('should return country id', () => {
      expect(
        getContactCountryId({
          contact: { profile: { countryId: 2 } },
        }),
      ).toBe(2);
    });

    it('should return null', () => {
      expect(getContactCountryId({})).toBe(null);
      expect(getContactCountryId({ contact: { profile: null } }));
    });
  });
});
