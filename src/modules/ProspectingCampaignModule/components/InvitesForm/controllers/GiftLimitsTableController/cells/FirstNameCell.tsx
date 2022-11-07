import React, { memo, useMemo } from 'react';
import { Avatar, Box, Skeleton } from '@mui/material';
import { TableCellProps } from 'react-virtualized';
import { useSelector } from 'react-redux';
import { CampaignSettings } from '@alycecom/modules';
import { EntityId } from '@alycecom/utils';

import { TProspectingCampaignMember } from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';

export interface IFirstNameCellProps extends TableCellProps {
  rowData: TProspectingCampaignMember | undefined;
}

const FirstNameCell = ({ rowData }: IFirstNameCellProps): JSX.Element => {
  const member = useSelector(
    useMemo(() => CampaignSettings.selectors.getTeamMemberById(rowData?.userId as EntityId), [rowData]),
  );
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      {rowData?.userId ? <Avatar src={member?.imageUrl} /> : <Skeleton variant="circular" height={30} width={30} />}
      <Box display="flex" flexDirection="column" ml={1}>
        <Box lineHeight="20px" fontSize="16px" color="text.primary">
          {rowData?.userId ? (
            <>
              {member?.firstName} {member?.lastName}
            </>
          ) : (
            <Skeleton variant="text" width="75px" />
          )}
        </Box>
        <Box color="grey.main" fontSize="12px" lineHeight="18px">
          {rowData?.userId ? member?.email : <Skeleton variant="text" width={125} />}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(FirstNameCell);
