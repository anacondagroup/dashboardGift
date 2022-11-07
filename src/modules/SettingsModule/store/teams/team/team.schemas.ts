import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TeamField, TTeamFormParams } from './team.types';

export const teamInfoValidation = object().shape({
  [TeamField.Name]: string().default('').label('Team name').trim().required().min(2).max(255),
  [TeamField.GroupId]: string().default(null).nullable().label('Billing group').required(),
});

export const teamInfoFormDefaultValues = teamInfoValidation.getDefault() as TTeamFormParams;

export const teamInfoFormResolver = yupResolver(teamInfoValidation);
