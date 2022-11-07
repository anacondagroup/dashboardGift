import React, { useState } from 'react';
import { Button } from '@alycecom/ui';
import { Typography } from '@mui/material';

import { TActiveFilterSelection } from '../../../utils/roiTypes';

import RoiTeamsFilter from './RoiTeamsFilter';
import RoiCampaignsFilter from './RoiCampaignsFilter';
import RoiTeamMembersFilter from './RoiTeamMembersFilter';

const styles = {
  toggle: {
    marginLeft: 1,
    fontSize: '14px',
  },
  button: {
    minWidth: 'auto',
    padding: 0,
    fontSize: '14px',
  },
} as const;

interface IFilterSelector {
  type: TActiveFilterSelection;
  label: string;
}

const ROI_FILTER_TYPES = [
  {
    type: TActiveFilterSelection.Teams,
    label: 'Teams',
  },
  {
    type: TActiveFilterSelection.Campaigns,
    label: 'Campaigns',
  },
  {
    type: TActiveFilterSelection.TeamMembers,
    label: 'Team Member',
  },
];

const RoiFilterTypeSelector = (): JSX.Element => {
  const [activeFilter, setActiveFilter] = useState<TActiveFilterSelection>(TActiveFilterSelection.Teams);

  const handleSelectFilter = (type: TActiveFilterSelection): void => setActiveFilter(type);

  const possibleFilters = ROI_FILTER_TYPES.filter((element: IFilterSelector) => element.type !== activeFilter);

  return (
    <>
      {activeFilter === TActiveFilterSelection.Teams && <RoiTeamsFilter />}
      {activeFilter === TActiveFilterSelection.Campaigns && <RoiCampaignsFilter />}
      {activeFilter === TActiveFilterSelection.TeamMembers && <RoiTeamMembersFilter />}
      <Typography sx={styles.toggle}>
        or Report by{' '}
        <Button variant="text" sx={styles.button} onClick={() => handleSelectFilter(possibleFilters[0].type)}>
          {possibleFilters[0].label}
        </Button>{' '}
        or{' '}
        <Button variant="text" sx={styles.button} onClick={() => handleSelectFilter(possibleFilters[1].type)}>
          {possibleFilters[1].label}
        </Button>
      </Typography>
    </>
  );
};

export default RoiFilterTypeSelector;
