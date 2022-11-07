import React, { useCallback } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, AlyceTheme, FlatButton, HtmlTip, Icon } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { setContactsUploadingSectionState } from '../../../store/ui/createPage/contactsSidebar';
import { ContactsUploadingStates } from '../../../constants/recipientSidebar.constants';
import {
  IUploadRequestAttributes,
  UploadRequestSourceTypes,
  UploadRequestStatuses,
} from '../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import UploadingSectionContent from '../UploadingSectionContent';
import { getIsRecipientsStepCompleted } from '../../../store/steps/recipients';
import { getActivateModuleParams } from '../../../store/activate.selectors';
import { useBuilderSteps } from '../../../hooks/useBuilderSteps';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  actionButton: {
    color: palette.common.white,
    backgroundColor: palette.green.dark,

    '&:hover': {
      color: palette.common.white,
      backgroundColor: palette.green.mountainMeadowLight,
    },
  },
  button: {
    boxShadow: 'none',
  },
  buttonIcon: {
    marginLeft: spacing(1),
    marginRight: spacing(1),
  },
  linkButton: {
    marginBottom: 8,
    '& > div': {
      lineHeight: '1.2 !important',
    },
  },
}));

const errorReportList = (duplicated: number, optedOut: number, incorrect: number, total: number) => [
  {
    key: 'zeroContacts',
    value: total === 0,
    desc: `No contacts have been uploaded. Please try again.`,
  },
  {
    key: 'duplicated',
    value: duplicated,
    desc: `${duplicated} recipients’ emails are duplicates.`,
  },
  {
    key: 'optedOut',
    value: optedOut,
    desc: `${optedOut} recipients’ emails have opted-out of recieving emails`,
  },
  {
    key: 'incorrect',
    value: incorrect,
    desc: `${incorrect} recipients’ emails are incorrect and cannot be sent.`,
  },
];

interface IUploadingContactsFailProps {
  campaignName: string;
  attributes: IUploadRequestAttributes;
  onSuccess: () => void;
}

const UploadingContactsFail = ({
  campaignName,
  attributes,
  onSuccess,
}: IUploadingContactsFailProps): React.ReactElement => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isGenerateLinkAllowed = useSelector(getIsRecipientsStepCompleted);
  const { isEditorMode, isBuilderMode } = useSelector(getActivateModuleParams);

  const { total, duplicated, optedOut, incorrect, completed, report, status, source } = attributes;
  const zeroUploadedContacts = completed === 0;
  const isBackToListUploadVisible =
    source === UploadRequestSourceTypes.File || source === UploadRequestSourceTypes.MarketoStatic || isEditorMode;
  const wrongRecipientsCount = duplicated + optedOut + incorrect;

  const handleBackButton = useCallback(() => {
    const previousState =
      source === UploadRequestSourceTypes.File || isEditorMode
        ? ContactsUploadingStates.XLSX
        : ContactsUploadingStates.Integration;
    dispatch(setContactsUploadingSectionState(previousState));
  }, [dispatch, source, isEditorMode]);

  const { goToNextStep } = useBuilderSteps();
  const handleSaveButton = useCallback(() => {
    onSuccess();
    if (isBuilderMode) {
      goToNextStep();
    }
  }, [goToNextStep, onSuccess, isBuilderMode]);

  return (
    <UploadingSectionContent
      title="Heads up! We have a few issues you need to look at!"
      description={`Out of the ${total} recipients you uploaded to the ${campaignName}, there are
          ${wrongRecipientsCount} issues you need to address${
        !isEditorMode ? ' before continuing' : ''
      }. Below, you can find details
          on the found issues:`}
    >
      {status === UploadRequestStatuses.Error && (
        <Box py={1}>
          {isBackToListUploadVisible && (
            <Box display="flex" alignItems="center">
              <FlatButton className={classes.linkButton} icon="arrow-left" onClick={handleBackButton}>
                Back to list upload
              </FlatButton>
            </Box>
          )}
          <div className="Body-Regular-Left-Error">
            Something went wrong during uploading of contacts. Please try again.
          </div>
          {!isEditorMode && (
            <Box mt={3}>
              <HtmlTip>
                If you want to edit errors and re-upload the list, please go back to the previous screen by pressing
                “Back to list upload”.
              </HtmlTip>
            </Box>
          )}
        </Box>
      )}

      {status === UploadRequestStatuses.Complete && (
        <>
          <Box py={1}>
            {isBackToListUploadVisible && (
              <Box display="flex" alignItems="center">
                <FlatButton className={classes.linkButton} icon="arrow-left" onClick={handleBackButton}>
                  Back to list upload
                </FlatButton>
              </Box>
            )}
            {errorReportList(duplicated, optedOut, incorrect, total)
              .filter(({ value }) => !!value)
              .map(error => (
                <li key={error.key} className="Body-Regular-Left-Error">
                  <span className="Body-Regular-Left-Error">{error.desc}</span>
                </li>
              ))}
            <Box my={3}>
              <Divider />
            </Box>
            {isEditorMode ? (
              <Box mb={2}>
                <a href={report || ''} download>
                  <ActionButton width="100%" disabled={total === 0}>
                    <Icon icon="file-download" />
                    <Box ml={1}>Download report of errors {zeroUploadedContacts}</Box>
                  </ActionButton>
                </a>
              </Box>
            ) : (
              <>
                <Box mb={2}>
                  <Box mb={3} className="Body-Medium-Inactive">
                    How would you like to continue?
                  </Box>
                  <a href={report || ''} download>
                    <ActionButton width="100%" disabled={total === 0}>
                      <Icon icon="file-download" />
                      <Box ml={1}>Download report of errors {zeroUploadedContacts && 'and reupload list'}</Box>
                    </ActionButton>
                  </a>
                </Box>
                <HtmlTip>
                  If you want to edit errors and re-upload the list, please go back to the previous screen by pressing
                  “Back to list upload”.
                </HtmlTip>
                <Box my={2} textAlign="center" className="Label-Table-Left-Active">
                  OR
                </Box>
                <Box px={3} width="100%" display="flex" justifyContent="space-between" alignItems="center">
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    onClick={handleSaveButton}
                    fullWidth
                    disabled={!isGenerateLinkAllowed}
                  >
                    Exclude contacts with errors and continue
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
    </UploadingSectionContent>
  );
};

export default UploadingContactsFail;
