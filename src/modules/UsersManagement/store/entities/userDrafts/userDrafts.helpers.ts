import { TDictionary } from '@alycecom/utils';

import { IUserDraft } from './userDrafts.types';

export const transformUserDraftsToMap = (drafts: IUserDraft[], company: string): TDictionary<IUserDraft> =>
  drafts.reduce((acc, draft) => Object.assign(acc, { [draft.id]: { ...draft, company } }), {});
