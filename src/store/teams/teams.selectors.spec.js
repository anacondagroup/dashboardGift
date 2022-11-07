import { makeCanEditTeamById, makeGetCurrencyByTeamId, makeGetTeamById } from './teams.selectors';

const usaCurrency = { id: 11, name: 'USA', sign: '$' };
const canCurrency = { id: 10, name: 'Canada', sign: 'CAD' };
const currenciesMap = {
  11: usaCurrency,
  10: canCurrency,
};

describe('Teams selectors', () => {
  test('makeGetTeamById', () => {
    expect(makeGetTeamById('13').resultFunc([{ id: 12 }, { id: 13 }])).toEqual({ id: 13 });
  });

  describe('makeGetCurrencySignByTeamId', () => {
    it('should get currency by id from team settings', () => {
      expect(makeGetCurrencyByTeamId(2).resultFunc({ settings: { currency_id: 11 } }, currenciesMap)).toEqual(
        usaCurrency,
      );
    });

    it('should return null if currency or team is absent', () => {
      expect(makeGetCurrencyByTeamId(2).resultFunc(null, currenciesMap)).toBe(null);
      expect(makeGetCurrencyByTeamId(2).resultFunc({ settings: { currency_id: 11 } }, { 10: canCurrency })).toBe(null);
    });
  });

  describe('makeCanEditTeamById', () => {
    it('should return false when user has not data about it', () => {
      expect(makeCanEditTeamById('13').resultFunc({ canManageTeams: null }, true)).toBe(false);
    });

    it('should return false when user cannot manage that team', () => {
      expect(makeCanEditTeamById('13').resultFunc({ canManageTeams: [11] }, true)).toBe(false);
    });

    it('should return false is enterprise mode not enabled for the team', () => {
      expect(makeCanEditTeamById('13').resultFunc({ canManageTeams: [13] }, false)).toBe(false);
    });

    it('should return true when enterprise mode enabled and user can manage the team', () => {
      expect(makeCanEditTeamById('13').resultFunc({ canManageTeams: [13] }, true)).toBe(true);
    });
  });
});
