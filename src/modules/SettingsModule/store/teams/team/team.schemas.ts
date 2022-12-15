import { object, string, StringSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TeamField, TTeamFormParams } from './team.types';
import { NEW_BILLING_GROUP_ID } from './team.constants';

export const teamInfoValidation = object().shape({
  [TeamField.Name]: string().default('').label('Team name').trim().required().min(2).max(255),
  [TeamField.GroupId]: string().default(null).nullable().label('Billing group').required(),
  [TeamField.GroupName]: string()
    .label('Group Name')
    .nullable()
    .default('')
    .trim()
    .when(TeamField.GroupId, (groupId: string, schema: StringSchema<string | null>) =>
      groupId === NEW_BILLING_GROUP_ID ? schema.trim().min(2).max(255).required() : schema,
    ),
});

export const teamInfoFormDefaultValues = teamInfoValidation.getDefault() as TTeamFormParams;

export const teamInfoFormResolver = yupResolver(teamInfoValidation);
