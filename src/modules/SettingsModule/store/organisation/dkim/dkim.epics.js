import { domainsEpics } from './domains/domains.epics';
import { detailsEpics } from './details/details.epics';

export const dkimEpics = [...domainsEpics, ...detailsEpics];
