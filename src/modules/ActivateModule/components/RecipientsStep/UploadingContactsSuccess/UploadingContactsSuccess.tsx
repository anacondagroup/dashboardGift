import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, FlatButton } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import downloadLink from '../../../assets/images/la-link-generated.png';
import { setContactsUploadingSectionState } from '../../../store/ui/createPage/contactsSidebar';
import { ContactsUploadingStates } from '../../../constants/recipientSidebar.constants';
import {
  IUploadRequestAttributes,
  UploadRequestSourceTypes,
} from '../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import { getSelectedMarketoListType } from '../../../store/steps/recipients/marketo';
import UploadingSectionContent from '../UploadingSectionContent';
import { getActivateModuleParams } from '../../../store/activate.selectors';
import { useBuilderSteps } from '../../../hooks/useBuilderSteps';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
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

const getTitle = (source: UploadRequestSourceTypes) => {
  switch (source) {
    case UploadRequestSourceTypes.MarketoDynamic:
      return 'Smart campaign has been linked!';
    default:
      return 'Uploading and verification complete!';
  }
};

interface IUploadingContactsSuccessProps {
  campaignName: string;
  attributes: IUploadRequestAttributes;
  onSuccess: () => void;
}

const UploadingContactsSuccess = ({
  campaignName,
  attributes,
  onSuccess,
}: IUploadingContactsSuccessProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { source, total } = attributes;
  const selectedListType = useSelector(getSelectedMarketoListType);
  const { isEditorMode, isBuilderMode } = useSelector(getActivateModuleParams);
  const displayDescription =
    source !== UploadRequestSourceTypes.MarketoDynamic && source !== UploadRequestSourceTypes.Eloqua;
  const displayBackButton =
    (!isEditorMode && source !== UploadRequestSourceTypes.Eloqua && source !== UploadRequestSourceTypes.HubSpot) ||
    (isEditorMode && source === UploadRequestSourceTypes.File);
  const nextButtonText = isEditorMode ? 'Close' : 'Continue';

  const handleBackButton = useCallback(() => {
    if (selectedListType && !isEditorMode) {
      dispatch(setContactsUploadingSectionState(ContactsUploadingStates.Integration));
    } else {
      dispatch(setContactsUploadingSectionState(ContactsUploadingStates.XLSX));
    }
  }, [dispatch, selectedListType, isEditorMode]);

  const { goToNextStep } = useBuilderSteps();
  const handleSaveButton = useCallback(() => {
    onSuccess();
    if (isBuilderMode) {
      goToNextStep();
    }
  }, [goToNextStep, isBuilderMode, onSuccess]);

  return (
    <UploadingSectionContent
      title={source && getTitle(source)}
      description={
        displayDescription
          ? ` No issues were found in the ${total} contacts that were uploaded to ${campaignName}.`
          : undefined
      }
    >
      <Box py={3} textAlign="center">
        <img src={downloadLink} alt="Download link" />
      </Box>
      <Box>
        <Box
          width="100%"
          display="flex"
          justifyContent={displayBackButton ? 'space-between' : 'flex-end'}
          alignItems="center"
        >
          {displayBackButton && (
            <Box mb={1} display="flex" alignItems="center">
              <FlatButton className={classes.linkButton} icon="arrow-left" onClick={handleBackButton}>
                Back to list upload
              </FlatButton>
            </Box>
          )}
          <Box width="190">
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleSaveButton}
              fullWidth
            >
              {nextButtonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </UploadingSectionContent>
  );
};

export default UploadingContactsSuccess;
