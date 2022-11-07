import { prop, pipe } from 'ramda';

import { getOrganisationState } from '../organisation.selectors';

export const getDkimState = pipe(getOrganisationState, prop('dkim'));
