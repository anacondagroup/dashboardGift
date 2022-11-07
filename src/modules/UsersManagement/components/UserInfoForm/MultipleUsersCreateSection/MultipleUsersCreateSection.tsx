import React, { useCallback, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Icon } from '@alycecom/ui';
import { useDispatch } from 'react-redux';

import { setUsersSidebarStep } from '../../../store/usersOperation/usersOperation.actions';
import { UsersSidebarStep } from '../../../store/usersOperation/usersOperation.types';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  button: {
    color: palette.grey.chambray50,
    borderColor: palette.grey.chambray50,
    width: 265,
    padding: spacing(2),
  },
  icon: {
    marginRight: spacing(1),
    '& > svg': {
      fontSize: '60px !important',
    },
  },
  tip: {
    fontSize: 14,
  },
}));

const MultipleUsersCreateSection = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleOpenBulkUpload = useCallback(() => dispatch(setUsersSidebarStep(UsersSidebarStep.chooseFile)), [
    dispatch,
  ]);

  return (
    <Box>
      <Box mb={3}>
        <Typography className="H4-Chambray">Or create multiple users at once</Typography>
        <Typography className="Body-Regular-Left-Chambray">Import their info from a file</Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Button
          classes={{
            root: classes.button,
            startIcon: classes.icon,
          }}
          variant="outlined"
          startIcon={<Icon icon="file-upload" />}
          onClick={handleOpenBulkUpload}
        >
          <Box width={150} textAlign="left">
            <Typography>XLSX file</Typography>
            <Typography className={classes.tip}>Upload a file in XLSX format</Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default memo(MultipleUsersCreateSection);
