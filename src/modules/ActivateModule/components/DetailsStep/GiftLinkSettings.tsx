import React, { memo, useEffect, useRef } from 'react';
import { CampaignSettings, Features, HasFeature, User } from '@alycecom/modules';
import {
  Box,
  Collapse,
  FormControlLabel,
  FormControlProps,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Controller, useFormContext } from 'react-hook-form';
import { AlyceTheme, SelectFilter } from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';
import { useSelector } from 'react-redux';

import { DetailsFormFields } from '../../store/steps/details/detailsForm.schemas';
import { DetailsConstants } from '../../constants/details.constants';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { getDetailsData } from '../../store/steps/details';

const useStyles = makeStyles<AlyceTheme>(() => ({
  container: {
    width: 700,
  },
}));

type TGiftLinkSettingsProps = Omit<FormControlProps, 'error' | 'children'> & {
  error?: string;
};

const GiftLinkSettings = ({ error = '', ...formControlProps }: TGiftLinkSettingsProps): JSX.Element => {
  const classes = useStyles();
  const { control, setValue, watch } = useFormContext();

  const data = useSelector(getDetailsData);
  const hasCampaign = !!data;
  const teamId = data?.teamId;
  const sendAsId = data?.sendAsId;

  const selectedTeamId = watch(DetailsFormFields.Team) || teamId;
  const sendAsOption = watch(DetailsFormFields.SendAsOption);

  const user = useSelector(User.selectors.getUser);

  const { ids: teamMembersIds, isLoading: isTeamMembersLoading, isLoaded, entities: teamMembersMap } = useTeamMembers(
    selectedTeamId,
  );
  const getTeamMemberLabel = (id: EntityId) => `${teamMembersMap[id]?.firstName} ${teamMembersMap[id]?.lastName}` ?? '';

  useEffect(() => {
    const isReadyToUpdate = isLoaded && selectedTeamId && sendAsOption === DetailsConstants.Single;
    const isTeamTheSame = teamId === selectedTeamId;
    if (isReadyToUpdate && user && !isTeamTheSame) {
      setValue(DetailsFormFields.SendAsId, user.id, { shouldValidate: true });
      return;
    }
    if (isReadyToUpdate && (sendAsId || user) && isTeamTheSame) {
      setValue(DetailsFormFields.SendAsId, sendAsId || user.id, { shouldValidate: true });
    }
  }, [setValue, isLoaded, user, selectedTeamId, teamId, sendAsId, sendAsOption]);

  const isMount = useRef(false);
  useEffect(() => {
    const isReadyToUpdate = isLoaded && !hasCampaign && sendAsOption === DetailsConstants.Single;
    if (isReadyToUpdate && !isMount.current) {
      setValue(DetailsFormFields.SendAsId, user.id);
      isMount.current = true;
    }
  }, [setValue, isLoaded, sendAsOption, hasCampaign, user]);

  return (
    <HasFeature featureKey={Features.FLAGS.MULTIPLE_GIFT_LINKS}>
      <Box mt={9} className={classes.container}>
        <CampaignSettings.SectionTitle>Gifting Personalization Settings</CampaignSettings.SectionTitle>
        <Typography className="Body-Regular-Left-Static">
          Alyce’s Gift Redemption Landing Pages will show the person who is sending the gift.
          <br />
          <br />
          For this campaign, would you like to send the gifts on behalf of a single person, or send on behalf of
          specific team members (each team member will have a unique gift link generated)?
          <span>*</span>
        </Typography>
        <Controller
          control={control}
          name={DetailsFormFields.SendAsOption}
          render={({ field }) => (
            <RadioGroup
              {...field}
              onChange={event => {
                field.onChange(event);
                if (event.target.value === DetailsConstants.Multiple) {
                  setValue(DetailsFormFields.SendAsId, null);
                }
              }}
              aria-label="giftExchangeOptions"
            >
              <FormControlLabel
                value={DetailsConstants.Single}
                control={<Radio color="primary" />}
                label="One link with a gift attributed to a specific person on the team"
              />
              <Collapse in={sendAsOption === DetailsConstants.Single} unmountOnExit mountOnEnter>
                <Controller
                  control={control}
                  name={DetailsFormFields.SendAsId}
                  render={({ field: { name: controlName, value: sendAsValue, onChange: sendAsOnChange, onBlur } }) => (
                    <Box ml={4}>
                      <SelectFilter
                        {...formControlProps}
                        name={controlName}
                        label="Select Team Member"
                        value={sendAsValue && isLoaded ? sendAsValue : ''}
                        dataTestId="CreateActivateCampaignStepper.SendAsId"
                        selectProps={{
                          onBlur,
                        }}
                        error={!!error}
                        helperText={error}
                        disabled={isTeamMembersLoading || !selectedTeamId}
                        onFilterChange={selectValue => sendAsOnChange(selectValue[controlName])}
                        required
                        renderItems={() =>
                          teamMembersIds.map(id => (
                            <MenuItem key={id} value={id}>
                              {getTeamMemberLabel(id)}
                            </MenuItem>
                          ))
                        }
                      />
                    </Box>
                  )}
                />
              </Collapse>

              <FormControlLabel
                value={DetailsConstants.Multiple}
                control={<Radio color="primary" />}
                label="Unique gift links for each member of the team"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </HasFeature>
  );
};

export default memo(GiftLinkSettings);
