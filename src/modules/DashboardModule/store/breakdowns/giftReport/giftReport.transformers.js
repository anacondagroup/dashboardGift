export const transformGiftReportRequest = ({ email, from, to, memberId, teamId, campaignId }) =>
  Object.entries({
    email,
    from,
    to,
    team_member_id: memberId,
    team_id: teamId,
    campaign_id: campaignId,
  }).reduce((res, [key, value]) => (value ? { ...res, [key]: value } : res), {});
