import { TBudgetCreateParams } from '../store/teams/budgetCreate/budgetCreate.types';
import { IBudget } from '../store/teams/budgets/budgets.types';

export const convertBudgetToCents = (budget: TBudgetCreateParams): TBudgetCreateParams => {
  const convertedTeamMemberBudgets = budget.teamMembers.map(memberBudget => ({
    ...memberBudget,
    budget: Math.floor(memberBudget.budget * 100),
  }));

  const convertedBudget: TBudgetCreateParams = {
    ...budget,
    amount: Math.floor(budget.amount * 100),
    teamMembers: convertedTeamMemberBudgets,
  };

  return convertedBudget;
};

export const convertBudgetToDollars = (budget: IBudget): IBudget => {
  const convertedTeamMemberBudgets = budget.teamMembers.map(memberBudget => ({
    ...memberBudget,
    budget: memberBudget.budget / 100,
  }));

  const convertedBudget: IBudget = {
    ...budget,
    amount: budget.amount / 100,
    teamMembers: convertedTeamMemberBudgets,
  };

  return convertedBudget;
};
