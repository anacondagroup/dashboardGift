import React, { memo, ReactNode } from 'react';
import { TTeamMember } from '@alycecom/services';
import { Autocomplete, AutocompleteGetTagProps, Avatar, Chip, TextField } from '@mui/material';

interface ITeamMemberPickerProps {
  teamMembers: TTeamMember[];
  campaignSpecificTeamMembers: TTeamMember[];
  setCampaignSpecificTeamMembers: (teamMembers: TTeamMember[]) => void;
}

const TeamMembersPicker = ({
  teamMembers,
  campaignSpecificTeamMembers,
  setCampaignSpecificTeamMembers,
}: ITeamMemberPickerProps): JSX.Element => {
  const getOptionLabel = (teamMember: TTeamMember) => `${teamMember.firstName} ${teamMember.lastName}`;

  const getRenderTags = (selected: TTeamMember[], getTagProps: AutocompleteGetTagProps): ReactNode => {
    const handleDelete = (teamMember: TTeamMember) => {
      const newMembers = campaignSpecificTeamMembers.filter(member => member.id !== teamMember.id);
      setCampaignSpecificTeamMembers(newMembers);
    };

    return selected.map((teamMember, index) => (
      <Chip
        {...getTagProps({ index })}
        onDelete={() => handleDelete(teamMember)}
        label={getOptionLabel(teamMember)}
        avatar={<Avatar src={teamMember.imageUrl} />}
      />
    ));
  };
  return (
    <Autocomplete
      options={teamMembers}
      renderInput={params => <TextField {...params} label="Specified users" variant="outlined" />}
      getOptionLabel={getOptionLabel}
      multiple
      renderTags={getRenderTags}
      value={campaignSpecificTeamMembers}
      onChange={(_, value) => setCampaignSpecificTeamMembers(value)}
    />
  );
};

export default memo(TeamMembersPicker);
