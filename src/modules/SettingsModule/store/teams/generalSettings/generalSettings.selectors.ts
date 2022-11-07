import { createSelector, OutputSelector } from 'reselect';
import { DefaultRootState } from 'react-redux';
import { ifElse, path, prop, head, type, identity, equals, pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToSettings = (state: IRootState) => state.settings.teams.generalSettings;

export const getIsLoading = pipe(pathToSettings, prop('isLoading'));

export const getIsLoaded = pipe(pathToSettings, prop('isLoaded'));

export const getTeamId = pipe(pathToSettings, prop('teamId'));

export const getTeamName = pipe(pathToSettings, prop('teamName'));

export const getTeamOwnerName = pipe(pathToSettings, prop('teamOwnerName'));

export const getOuterUnsubscribeUrl = pipe(pathToSettings, prop('outerUnsubscribeUrl'));

export const getRequireEmailIntegration = pipe(pathToSettings, prop('requireEmailIntegration'));

export const getNameUsageInEmails = pipe(pathToSettings, prop('nameUsageInEmails'));

export const getIsBlockReminders = pipe(pathToSettings, prop('blockReminders'));

export const getIsComplianceRequired = pipe(pathToSettings, prop('complianceIsRequired'));

export const getCompliancePromptText = pipe(pathToSettings, prop('compliancePromptText'));

export const getComplianceRevertText = pipe(pathToSettings, prop('complianceRevertText'));

export const getComplianceLink = pipe(pathToSettings, path(['complianceLink']));

export const getCanOverrideGiftExpireInDaysSetting = pipe(pathToSettings, prop('canOverrideGiftExpireInDaysSetting'));

export const getErrors = pipe(pathToSettings, prop('errors')) as (
  State: DefaultRootState,
) => Record<string, string | string[]>;

export const getErrorByProp = (
  property: string,
): OutputSelector<DefaultRootState, string, (res: Record<string, string | string[]>) => string> =>
  createSelector<DefaultRootState, Record<string, string | string[]>, string>(
    getErrors,
    pipe(prop(property), ifElse(pipe(type, equals('Array')), head, identity)),
  );
