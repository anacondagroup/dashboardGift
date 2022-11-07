import { array, boolean, number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { MAX_BUDGET } from '../../../constants/teamSidebarProgress.constants';

import {
  BudgetCreateField,
  BudgetType,
  PauseGiftingOnOption,
  TBudgetCreateParams,
  RefreshPeriod,
} from './budgetCreate.types';

const idSchema = number();
const amountSchema = number();

export const teamBudgetSchema = object().shape({
  [BudgetCreateField.Amount]: number()
    .required()
    .default(0)
    .label('Team budget')
    .positive()
    .min(0)
    .max(MAX_BUDGET, "The Team's budget must not exceed $99,999,999.99"),
  [BudgetCreateField.Type]: string().required().default(BudgetType.User).label('Budget type'),
  [BudgetCreateField.RefreshPeriod]: string().required().default(RefreshPeriod.Monthly).label('Refresh Period'),
  [BudgetCreateField.PauseOption]: string()
    .required()
    .default(PauseGiftingOnOption.Claimed)
    .label('Pause gifting when'),
  [BudgetCreateField.TeamMemberBudgets]: array()
    .of(
      object().shape({
        userId: idSchema,
        amount: amountSchema,
      }),
    )
    .default([]),
  [BudgetCreateField.NotifyTeamAdminType]: string().nullable().default(null),
  [BudgetCreateField.NotifySenderType]: string().nullable().default(null),
  [BudgetCreateField.NotifySenderAtPercent]: number().nullable().default(null),
  [BudgetCreateField.NotifyTeamAdminAtPercent]: number().nullable().default(null),
  [BudgetCreateField.Rollover]: boolean().default(false),
});

export const teamBudgetFormDefaultValues = teamBudgetSchema.cast({
  [BudgetCreateField.Amount]: 0,
  [BudgetCreateField.Type]: BudgetType.User,
  [BudgetCreateField.RefreshPeriod]: RefreshPeriod.Monthly,
  [BudgetCreateField.PauseOption]: PauseGiftingOnOption.Claimed,
  [BudgetCreateField.TeamMemberBudgets]: [],
}) as TBudgetCreateParams;

export const teamBudgetFormResolver = yupResolver(teamBudgetSchema);
