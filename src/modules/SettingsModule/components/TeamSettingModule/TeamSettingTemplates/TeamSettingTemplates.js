import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CommonData, SettingsItem } from '@alycecom/modules';
import { fakeItemsFactory } from '@alycecom/utils';
import { ActionButton, DashboardIcon, SearchField, DiscardAlert } from '@alycecom/ui';
import { Box, Grid, Paper, Button, Avatar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import {
  createNewCustomTemplate,
  createNewCustomTemplateRequest,
  deleteCustomTemplateRequest,
  discardNewCustomTemplate,
  loadCustomTemplatesRequest,
  updateCustomTemplateRequest,
} from '../../../store/teams/customTemplates/customTemplates.actions';
import { getCustomTemplates } from '../../../store/teams/customTemplates/customTemplates.selectors';
import EmptyDataset from '../../../../../components/Shared/EmptyDataset';

import TeamSettingEditTemplate from './TeamSettingEditTemplate/TeamSettingEditTemplate';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    width: '100%',
    borderTop: `1px solid ${palette.divider}`,
    padding: spacing(3),
  },
  avatar: {
    backgroundColor: palette.error.main,
    width: 46,
    height: 46,
    marginRight: spacing(2),
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: palette.grey.main,
    border: `1px solid ${palette.divider}`,
    boxShadow: 'none',
    marginRight: spacing(1),
    height: '48px',
    padding: spacing(1, 4),
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  submitButton: {
    backgroundColor: palette.error.main,
    color: 'white',
    boxShadow: 'none',
    height: '48px',
    padding: spacing(1, 4),
    '&:hover': {
      backgroundColor: palette.error.main,
    },
  },
}));

const TeamSettingTemplates = ({ teamId }) => {
  const { search } = useUrlQuery(['search']);
  const updateUrlFunc = useSetUrlQuery();

  const [templateWillDelete, setTemplateWillDelete] = useState(undefined);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { templates, teamName, createTemplate, isLoading } = useSelector(getCustomTemplates);
  const charsLimit = useSelector(CommonData.selectors.getEmailCharLimit);

  useEffect(() => {
    dispatch(loadCustomTemplatesRequest(teamId));
  }, [dispatch, teamId]);

  const templateItems = useMemo(() => {
    const fakeItems = fakeItemsFactory(templates, isLoading, () => ({ name: '', message: '' }), 3);
    const searchByName = ({ name }) => R.includes(R.toLower(search), R.toLower(name));
    return isLoading ? fakeItems : R.pipe(search ? R.filter(searchByName) : R.identity)(templates);
  }, [templates, isLoading, search]);

  const handleCreateNewTemplate = useCallback(() => {
    if (!createTemplate) {
      dispatch(createNewCustomTemplate());
    }
  }, [dispatch, createTemplate]);

  const handleDiscardNewTemplate = useCallback(() => {
    dispatch(discardNewCustomTemplate());
  }, [dispatch]);

  const handleOnSaveTemplate = useCallback(
    ({ id, template }) => {
      if (!id) {
        dispatch(createNewCustomTemplateRequest({ teamId, template }));
      } else {
        dispatch(updateCustomTemplateRequest({ teamId, id, template }));
      }
    },
    [dispatch, teamId],
  );

  const handleDeleteTemplate = useCallback(id => {
    setTemplateWillDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    dispatch(deleteCustomTemplateRequest({ teamId, id: templateWillDelete }));
    setTemplateWillDelete(undefined);
  }, [dispatch, templateWillDelete, teamId]);

  const handleQuery = useCallback(
    value => {
      updateUrlFunc(
        {
          search,
          ...value,
        },
        false,
        true,
      );
    },
    [updateUrlFunc, search],
  );

  return (
    <DashboardLayout>
      <Box mb={2}>
        <Typography className="H3-Dark">{teamName} custom templates</Typography>
      </Box>
      <Paper elevation={1}>
        <Box p={3} display="flex">
          <Grid container wrap="nowrap">
            <SearchField
              placeholder="Search template"
              value={search}
              onChange={event => handleQuery({ search: event.target.value })}
            />
          </Grid>
          <Box display="inline-flex" pl={2}>
            <ActionButton id="create_new_template" width={210} onClick={() => handleCreateNewTemplate()}>
              <div>
                <DashboardIcon icon="plus" color="white" />
                <Box ml={1} className="Body-Regular-Center-White" display="inline">
                  Create new template
                </Box>
              </div>
            </ActionButton>
          </Box>
        </Box>
        <Box mb={3}>
          <Grid container direction="row">
            {createTemplate && (
              <Box className={classes.root}>
                <TeamSettingEditTemplate
                  charsLimit={charsLimit}
                  onSave={handleOnSaveTemplate}
                  onDiscard={handleDiscardNewTemplate}
                  isUploading={createTemplate.isUploading}
                  isNew
                />
              </Box>
            )}
            {!templateItems.length && (
              <Box mt={5} mb={5} ml="auto" mr="auto">
                <EmptyDataset dataSetName="templates" teamName={teamName} />
              </Box>
            )}
            {templateItems.length > 0 &&
              templateItems.map(({ id, name, message, subject }, i) => (
                <SettingsItem
                  key={id || i}
                  title={name}
                  description={message}
                  isLoading={isLoading}
                  collapsible
                  buttonCta="Change"
                  descRowLimit={2}
                >
                  <TeamSettingEditTemplate
                    name={name}
                    id={id}
                    message={message}
                    subject={subject}
                    charsLimit={charsLimit}
                    onSave={handleOnSaveTemplate}
                    onDelete={handleDeleteTemplate}
                  />
                </SettingsItem>
              ))}
          </Grid>
        </Box>
      </Paper>
      <DiscardAlert
        renderTitle={() => (
          <>
            <Avatar className={classes.avatar}>
              <DashboardIcon className={classes.icon} icon="times" color="white" />
            </Avatar>
            <Typography>Are you sure to delete the template?</Typography>
          </>
        )}
        renderBody={() => {}}
        renderActions={() => (
          <>
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={() => setTemplateWillDelete(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="red"
              className={classes.submitButton}
              autoFocus
              onClick={() => handleConfirmDelete()}
            >
              Delete
            </Button>
          </>
        )}
        isOpen={!!templateWillDelete}
      />
    </DashboardLayout>
  );
};

TeamSettingTemplates.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default TeamSettingTemplates;
