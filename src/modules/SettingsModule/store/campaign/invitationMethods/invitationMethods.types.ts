export interface IGiftInvitationMethod {
  id: number;
  label: string;
  icon: string;
  blockedByTeam: boolean;
  restrictedByCampaign: boolean;
  allowedForCountries: boolean;
}
