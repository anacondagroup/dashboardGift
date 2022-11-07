import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { UserRoles } from '../usersManagement.types';

import { IUserAssignParams, TUserCreateParams } from './usersCreate.types';

export const userInfoValidation = object().shape({
  email: string().default('').label('Email address').trim().required().min(2).max(255).email(),
  firstName: string().default('').label('First name').trim().required().min(2).max(255),
  lastName: string().default('').label('Last name').trim().required().min(2).max(255),
  company: string().default('').label('Company name').trim().required().min(2).max(255),
});

export const userAssignValidation = object().shape({
  role: string().default(UserRoles.member).label('Access level').required().oneOf([UserRoles.member, UserRoles.admin]),
  teams: array().default([]).label('Teams').min(1),
});

export const userInfoFormDefaultValues = userInfoValidation.getDefault() as TUserCreateParams;

export const userInfoFormResolver = yupResolver(userInfoValidation);

export const userAssignFormDefaultValues = userAssignValidation.getDefault() as IUserAssignParams;

export const userAssignFormResolver = yupResolver(userAssignValidation);
