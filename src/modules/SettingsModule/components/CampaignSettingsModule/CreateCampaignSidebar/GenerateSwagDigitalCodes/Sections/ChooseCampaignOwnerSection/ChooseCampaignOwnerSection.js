import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Select,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Divider,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';
import { Controller, useForm } from 'react-hook-form';
import { object, string, mixed } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import FullWidthHint from '../../../../../../../../components/Shared/FullWidthHint';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import {
  GENERATE_SWAG_DIGITAL_STATES,
  GSD_STEP_1,
  GSD_STEP_2,
} from '../../../../../../../../constants/swagDigital.constants';
import { swagDigitalCodesChangeStep } from '../../../../../../store/campaign/swagDigitalCodes/swagDigitalCodes.actions';
import { getGeneralSettingsBatchOwners } from '../../../../../../store/campaign/batchOwners/batchOwners.selectors';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 155,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const validationSchema = object().shape({
  ownerId: mixed().required('Member is required'),
  codesBatchName: string()
    .required('Batch name is required')
    .min(3, 'The batch name should be longer than 3 characters')
    .max(50, `The batch name should not exceed 50 characters`),
});

const ChooseCampaignOwnerSection = ({ title, order, status, data, campaignId, teamId, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    formState: { errors, isValid },
    getValues,
    control,
  } = useForm({
    mode: 'all',
    defaultValues: {
      ownerId: (data.owner && data.owner.id) || null,
      codesBatchName: data.codesBatchName || '',
    },
    resolver: yupResolver(validationSchema),
  });
  const { members, isLoading: isMembersLoading } = useSelector(getGeneralSettingsBatchOwners);

  const onBatchNameBlur = (e, formOnBlur, formOnChange) => {
    formOnChange(e.target.value ? e.target.value.trimRight() : '');
    formOnBlur(e);
  };

  const handleNextStep = useCallback(() => {
    const { ownerId, codesBatchName } = getValues();
    const owner = members.find(({ id }) => id === ownerId);
    dispatch(
      swagDigitalCodesChangeStep({
        current: GSD_STEP_1,
        next: GSD_STEP_2,
        data: { owner: { id: owner.id, name: owner.name }, codesBatchName },
      }),
    );
  }, [getValues, members, dispatch]);

  if (status === GENERATE_SWAG_DIGITAL_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId}>
        {`${data.codesBatchName} by ${data.owner.name}`}
      </CompletedSection>
    );
  }

  if (status === GENERATE_SWAG_DIGITAL_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  return (
    <>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box mt={1} className={classes.description}>
          Set which team and team member is responsible for this batch of codes.
        </Box>
      </Box>
      <FullWidthHint>
        <Box mb={1} className="Body-Regular-Left-Static-Bold">
          Please note, by default, the campaign owner will:
        </Box>
        <ul className={classes.ul}>
          <li className={classes.li}>Receive all notifications of status updates.</li>
          <li className={classes.li}>Be used for all calendar bookings.</li>
        </ul>
      </FullWidthHint>
      <Box px={3} pt={3}>
        <Box mt={2}>
          <FormControl
            variant="outlined"
            fullWidth
            disabled={(!teamId && !members.length) || isMembersLoading}
            error={!!errors.ownerId}
          >
            <InputLabel id="la_select_member_label">{isMembersLoading ? 'Loading...' : 'Select a member'}</InputLabel>
            <Controller
              name="ownerId"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  labelId="la_select_member_label"
                  label={isMembersLoading ? 'Loading...' : 'Select a member'}
                  id="la_select_member_label"
                  value={value || ''}
                  onChange={e => onChange(e.target.value)}
                  onBlur={onBlur}
                  labelWidth={117}
                >
                  {members.map(member => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.ownerId && <FormHelperText>{errors.ownerId.message}</FormHelperText>}
          </FormControl>
        </Box>
        <Box py={3}>
          <Divider />
        </Box>
        <Box pb={2}>
          <Box pb={0.5} className="Body-Medium-Static">
            Name this batch of cards
          </Box>
          <Box pb={2} className={classes.description}>
            Want to track your card performance more accurately? You can add a custom name this batch below.
          </Box>
          <Controller
            name="codesBatchName"
            control={control}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <TextField
                name={name}
                variant="outlined"
                label="Batch name"
                value={value}
                onChange={e => onChange(e.target.value.trimLeft())}
                onBlur={e => onBatchNameBlur(e, onBlur, onChange)}
                fullWidth
                error={!!errors.codesBatchName}
                helperText={errors.codesBatchName && errors.codesBatchName.message}
              />
            )}
          />
        </Box>
        <Box width="100%" mt={3} display="flex" justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleNextStep}
            fullWidth
            disabled={!isValid}
          >
            Next step
            {!isLoading ? (
              <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            ) : (
              <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
};

ChooseCampaignOwnerSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  data: PropTypes.shape({
    codesBatchName: PropTypes.string,
    owner: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  campaignId: PropTypes.number,
  teamId: PropTypes.number,
  isLoading: PropTypes.bool,
};

ChooseCampaignOwnerSection.defaultProps = {
  data: {},
  campaignId: undefined,
  teamId: undefined,
  isLoading: false,
};

export default ChooseCampaignOwnerSection;
