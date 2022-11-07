import { profileEpics } from './profile/profile.epics';
import { historyEpics } from './history/history.epics';

export default [...profileEpics, ...historyEpics];
