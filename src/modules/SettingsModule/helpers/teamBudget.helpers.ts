import { IBudget } from '../store/teams/budgets/budgets.types';

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
