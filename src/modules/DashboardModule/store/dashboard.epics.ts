import breakdownsEpics from './breakdowns/breakdowns.epics';
import { membersEpics } from './members/members.epics';
import { overviewEpics } from './overview/overview.epics';

export default [...breakdownsEpics, ...membersEpics, ...overviewEpics];
