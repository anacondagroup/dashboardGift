import { BudgetType, PauseGiftingOnOption, TBudgetCreateParams } from '../store/teams/budgetCreate/budgetCreate.types';
import { IBudget, PauseGiftingOn, RefreshPeriod } from '../store/teams/budgets/budgets.types';
import { convertBudgetToCents, convertBudgetToDollars } from './teamBudget.helpers';

describe('teamBudget helpers', () => {
  describe('convertBudgetToCents', () => {
    const budgetInDollars: TBudgetCreateParams = {
      teamMembers: [
        {
          userId: 1045,
          budget: 100,
        },
        {
          userId: 1046,
          budget: 100.12,
        },
        {
          userId: 1047,
          budget: 100.2,
        },
      ],
      pauseGiftingOn: PauseGiftingOnOption.Sent,
      period: 'monthly',
      type: BudgetType.User,
      amount: 300.32,
      rollover: false,
      notifySenderAtPercent: null,
      notifySenderType: null,
      notifyTeamAdminAtPercent: null,
      notifyTeamAdminType: null,
    };

    it('correctly converts', () => {
      const result = convertBudgetToCents(budgetInDollars);

      expect(result).toEqual({
        teamMembers: [
          { userId: 1045, budget: 10000 },
          { userId: 1046, budget: 10012 },
          { userId: 1047, budget: 10020 },
        ],
        pauseGiftingOn: 'sent',
        period: 'monthly',
        type: 'user',
        amount: 30032,
        rollover: false,
        notifySenderAtPercent: null,
        notifySenderType: null,
        notifyTeamAdminAtPercent: null,
        notifyTeamAdminType: null,
      });
    });
  });

  describe('convertBudgetToDollars', () => {
    const budgetInCents: IBudget = {
      teamId: 37,
      teamMembers: [
        { userId: 1045, budget: 10000 },
        { userId: 1046, budget: 10012 },
        { userId: 1047, budget: 10020 },
      ],
      pauseGiftingOn: PauseGiftingOn.Sent,
      period: RefreshPeriod.Monthly,
      amount: 30032,
      rollover: false,
      notifyTeamAdminType: null,
      notifySenderType: null,
      notifySenderAtPercent: null,
      notifyTeamAdminAtPercent: null,
    };

    it('converts correctly', () => {
      const result = convertBudgetToDollars(budgetInCents);

      expect(result).toEqual({
        teamId: 37,
        teamMembers: [
          {
            userId: 1045,
            budget: 100,
          },
          {
            userId: 1046,
            budget: 100.12,
          },
          {
            userId: 1047,
            budget: 100.2,
          },
        ],
        pauseGiftingOn: PauseGiftingOnOption.Sent,
        period: 'monthly',
        amount: 300.32,
        rollover: false,
        notifyTeamAdminType: null,
        notifySenderType: null,
        notifySenderAtPercent: null,
        notifyTeamAdminAtPercent: null,
      });
    });
  });
});
