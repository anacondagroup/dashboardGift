import React from 'react';
import { Box, Checkbox, Collapse, FormControlLabel, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { CampaignSettings, Features, HasFeature } from '@alycecom/modules';

import { GiftFormFields } from '../../../store/steps/gift/giftForm.schemas';
import { RecipientActions } from '../../../store';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  section: {
    width: 580,
  },
  hint: {
    fontSize: 14,
    color: palette.grey.main,
    marginLeft: spacing(3),
  },
  checkboxesWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginLeft: spacing(3),
  },
}));

interface IRecipientActionsSectionProps {
  formField: GiftFormFields;
}

const RecipientActionsSection = ({ formField }: IRecipientActionsSectionProps): JSX.Element => {
  const classes = useStyles();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const formErrors = errors[formField] || {};

  const captureQuestion = watch(`${formField}.${RecipientActions.captureQuestion}`);
  const captureAffidavit = watch(`${formField}.${RecipientActions.captureAffidavit}`);

  return (
    <>
      <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
        Recipient Actions
      </CampaignSettings.StyledSectionTitle>
      <Box className={classes.section}>
        <Typography className="Body-Regular-Left-Static-Bold">
          What, if anything, do you want a recipient to do in order to redeem their gift?
        </Typography>

        <Box className={classes.checkboxesWrapper}>
          <HasFeature featureKey={Features.FLAGS.ONE_TO_MANY_MEETING_BOOKER}>
            <Box>
              <Controller
                name={`${formField}.${RecipientActions.captureDate}`}
                control={control}
                render={({ field: { name, value, ref, onChange, onBlur } }) => (
                  <FormControlLabel
                    label={<Typography className="Body-Regular-Left-Static">Accept a calendar invite*</Typography>}
                    control={
                      <Checkbox
                        name={name}
                        inputRef={ref}
                        checked={value}
                        onChange={e => onChange(e.target.checked)}
                        onBlur={onBlur}
                        color="primary"
                      />
                    }
                  />
                )}
              />
              <Typography className={classes.hint}>
                * Due to anti-bribery laws: while meeting acceptance may be made obligatory, meeting attendance cannot
                be required
              </Typography>
            </Box>
          </HasFeature>

          <Controller
            name={`${formField}.${RecipientActions.capturePhone}`}
            control={control}
            render={({ field: { name, value, ref, onChange, onBlur } }) => (
              <FormControlLabel
                label={<Typography className="Body-Regular-Left-Static">Provide phone number</Typography>}
                control={
                  <Checkbox
                    name={name}
                    inputRef={ref}
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                    onBlur={onBlur}
                    color="primary"
                  />
                }
              />
            )}
          />

          <Controller
            name={`${formField}.${RecipientActions.captureEmail}`}
            control={control}
            render={({ field: { name, value, ref, onChange, onBlur } }) => (
              <FormControlLabel
                label={<Typography className="Body-Regular-Left-Static">Provide email address</Typography>}
                control={
                  <Checkbox
                    name={name}
                    inputRef={ref}
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                    onBlur={onBlur}
                    color="primary"
                  />
                }
              />
            )}
          />

          <Controller
            name={`${formField}.${RecipientActions.captureQuestion}`}
            control={control}
            render={({ field: { name, value, ref, onChange, onBlur } }) => (
              <FormControlLabel
                label={<Typography className="Body-Regular-Left-Static">Answer custom questions</Typography>}
                control={
                  <Checkbox
                    name={name}
                    inputRef={ref}
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                    onBlur={onBlur}
                    color="primary"
                  />
                }
              />
            )}
          />

          <Collapse in={captureQuestion} mountOnEnter unmountOnExit>
            <Controller
              control={control}
              name={`${formField}.${RecipientActions.question}`}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputRef={field.ref}
                  rows="3"
                  variant="outlined"
                  multiline
                  fullWidth
                  required
                  error={!!formErrors[RecipientActions.question]}
                  helperText={formErrors[RecipientActions.question]?.message}
                  classes={{ root: classes.textField }}
                />
              )}
            />
          </Collapse>

          <Controller
            name={`${formField}.${RecipientActions.captureAffidavit}`}
            control={control}
            render={({ field: { name, value, ref, onChange, onBlur } }) => (
              <FormControlLabel
                label={<Typography className="Body-Regular-Left-Static">Accept custom terms & conditions</Typography>}
                control={
                  <Checkbox
                    name={name}
                    inputRef={ref}
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                    onBlur={onBlur}
                    color="primary"
                  />
                }
              />
            )}
          />

          <Collapse in={captureAffidavit} mountOnEnter unmountOnExit>
            <Controller
              control={control}
              name={`${formField}.${RecipientActions.affidavit}`}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputRef={field.ref}
                  rows="3"
                  variant="outlined"
                  multiline
                  fullWidth
                  required
                  error={!!formErrors[RecipientActions.affidavit]}
                  helperText={formErrors[RecipientActions.affidavit]?.message}
                  classes={{ root: classes.textField }}
                />
              )}
            />
          </Collapse>
        </Box>
      </Box>
    </>
  );
};

export default RecipientActionsSection;
