export interface ITeam {
  id: number;
  name: string;
  archivedAt?: string | null;
  settings: {
    /* eslint-disable camelcase */
    country_id: number;
    currency_id: number;
    enterprise_mode_enabled: boolean;
    /* eslint-enable camelcase */
  };
}
