import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Dialog, DialogActions, DialogTitle, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LoadingLabel } from '@alycecom/ui';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import {
  organisationSettingsLogoRemoveRequest,
  organisationSettingsLogoUploadRequest,
} from '../../../../store/organisation/general/organisationGeneral.actions';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    borderTop: `1px solid ${palette.divider}`,
    padding: spacing(3),
  },
  header: {
    marginBottom: spacing(2),
  },
  input: {
    display: 'none',
  },
  buttonUpload: {
    color: palette.link.main,
    border: `1px solid ${palette.divider}`,
    backgroundColor: palette.common.white,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: palette.grey.A200,
    },
  },
  buttonRemoveHover: {
    '&:hover': {
      backgroundColor: palette.common.white,
    },
  },
  buttonRemove: {
    color: palette.red.main,
  },
  avatar: {
    margin: 10,
    width: 88,
    height: 88,
  },
  buttonsBlocK: {
    marginLeft: spacing(4),
  },
  dialogTitle: {
    cursor: 'move',
  },
}));

const OrganisationAvatarComponent = ({ alt, image, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const removeAvatarHandler = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fileChangedHandler = event => {
    if (event.target.files.length) {
      dispatch(organisationSettingsLogoUploadRequest(event.target.files[0]));
    }
  };

  const removeAvatarProcess = () => {
    handleClose();
    dispatch(organisationSettingsLogoRemoveRequest());
  };

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item className={classes.header}>
        <Typography className="H4-Dark-Bold">Organization Logo</Typography>
      </Grid>
      <Grid container item direction="row">
        <Grid item container xs={1} justifyContent="center" alignItems="center">
          {isLoading ? <LoadingLabel /> : <Avatar alt={alt} className={classes.avatar} src={image} />}
        </Grid>
        <Box ml={4}>
          <Grid item>
            <label htmlFor="contained-button-file">
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={fileChangedHandler}
              />
              <Button variant="contained" component="span" className={classes.buttonUpload}>
                Change
              </Button>
            </label>
          </Grid>
          <Grid item display="flex" justifyContent="center" alignItems="center">
            <Button
              color="primary"
              className={classNames(classes.buttonRemove, classes.buttonRemoveHover)}
              onClick={removeAvatarHandler}
            >
              Remove
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
              <DialogTitle className={classes.dialogTitle} id="draggable-dialog-title">
                Please confirm remove your avatar
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button className={classes.buttonRemove} onClick={removeAvatarProcess} color="primary">
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

OrganisationAvatarComponent.propTypes = {
  alt: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default OrganisationAvatarComponent;
