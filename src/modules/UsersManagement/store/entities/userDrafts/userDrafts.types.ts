export interface IUserDraft {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  isDuplicated?: boolean;
  hasTeam?: boolean;
  isWhitelistedDomain: boolean;
}
