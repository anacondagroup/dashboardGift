import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Collapse, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Controller, useFormContext } from 'react-hook-form';
import { AlyceTheme, ColorPicker } from '@alycecom/ui';
import classNames from 'classnames';

import { EmailBrandingFields, IBrandingSettings, BgOptions } from '../../store/emailBranding.types';
import { getBackground, getInitialBrandingSettings } from '../../store/brandingSettings/brandingSettings.selectors';
import { setBackgroundOption } from '../../store/brandingSettings/brandingSettings.reducer';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
  },
  tooltipIcon: {
    marginLeft: spacing(1),
  },
  colorField: {
    marginBottom: spacing(2),
  },
  MuiFormControlLabel: {
    alignItems: 'flex-start',
  },
  MuiRadioButton: {
    marginTop: -9,
  },
  labelTextMargin: {
    marginBottom: spacing(1),
  },
}));

export interface IBackgroundOptionsProps {
  onChangeField: (data: Partial<IBrandingSettings>) => void;
}

const BackgroundOptions = ({ onChangeField }: IBackgroundOptionsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const background = useSelector(getBackground);
  const { headerItemsOpacity = 0.5 } = useSelector(getInitialBrandingSettings) || {};

  const handleSelectOption = useCallback(
    ({ target }) => {
      dispatch(setBackgroundOption(target.value));
    },
    [dispatch],
  );

  const isAlycePattern = background === BgOptions.alycePattern;
  const isSolid = background === BgOptions.solid;

  const handleSelectAlycePattern = useCallback(() => {
    if (headerItemsOpacity) {
      setValue(EmailBrandingFields.headerItemsOpacity, headerItemsOpacity, { shouldDirty: true });
      onChangeField({
        [EmailBrandingFields.headerItemsOpacity]: headerItemsOpacity,
      });
    }
  }, [onChangeField, headerItemsOpacity, setValue]);

  const handleSelectSolidPattern = useCallback(() => {
    setValue(EmailBrandingFields.headerItemsOpacity, 0, { shouldDirty: true });
    onChangeField({
      [EmailBrandingFields.headerItemsOpacity]: 0,
    });
  }, [onChangeField, setValue]);

  return (
    <>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Typography className={classes.sectionTitle}>Background options</Typography>
      </Box>
      <Controller
        control={control}
        name={EmailBrandingFields.headerBackgroundColor}
        render={({ field: { onChange, value } }) => (
          <ColorPicker
            value={value}
            fieldProps={{
              name: EmailBrandingFields.headerBackgroundColor,
              label: 'Background Color',
              error: !!errors.headerBackgroundColor,
              helperText: errors.headerBackgroundColor && errors.headerBackgroundColor.message,
            }}
            wrapperProps={{ mb: 2 }}
            onChange={(inputValue: string) => {
              onChange(inputValue);
              onChangeField({ [EmailBrandingFields.headerBackgroundColor]: inputValue });
            }}
          />
        )}
      />
      <Box ml={2}>
        <RadioGroup aria-label="bgOption" name="bgOption" value={background} onChange={handleSelectOption}>
          <FormControlLabel
            data-testid="alyceGiftPattern.FormControlLabel"
            value={BgOptions.alycePattern}
            control={<Radio classes={{ root: classes.MuiRadioButton }} color="primary" />}
            classes={{ root: classes.MuiFormControlLabel }}
            label={
              <Box>
                <Typography
                  data-testid="alyceGiftPattern.LabelText"
                  className={classNames([
                    isAlycePattern ? 'Body-Regular-Center-Chambray-Bold' : 'Body-Regular-Left-Static',
                    classes.labelTextMargin,
                  ])}
                >
                  Use Alyce gift pattern
                </Typography>
              </Box>
            }
            onClick={handleSelectAlycePattern}
          />
          <Collapse in={isAlycePattern}>
            <Controller
              control={control}
              name={EmailBrandingFields.headerItemsColor}
              render={({ field: { onChange, value } }) => (
                <ColorPicker
                  value={value}
                  fieldProps={{
                    name: EmailBrandingFields.headerItemsColor,
                    label: 'Background Pattern Color',
                    error: !!errors.headerItemsColor,
                    helperText: errors.headerItemsColor && errors.headerItemsColor.message,
                  }}
                  wrapperProps={{ mb: 2 }}
                  onChange={(inputValue: string) => {
                    onChange(inputValue);
                    onChangeField({ [EmailBrandingFields.headerItemsColor]: inputValue });
                  }}
                />
              )}
            />
            <Box mb={2}>
              <Controller
                control={control}
                name={EmailBrandingFields.headerItemsOpacity}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    name={EmailBrandingFields.headerItemsOpacity}
                    variant="outlined"
                    value={value}
                    label="Pattern Opacity (0-1)"
                    fullWidth
                    error={!!errors.headerItemsOpacity}
                    helperText={errors.headerItemsOpacity && errors.headerItemsOpacity.message}
                    onChange={({ target }) => {
                      onChange(target.value);
                      const parsedValue = parseFloat(target.value);
                      const opacity = Number.isNaN(parsedValue) ? 0 : parsedValue;
                      onChangeField({ [EmailBrandingFields.headerItemsOpacity]: opacity });
                    }}
                  />
                )}
              />
            </Box>
          </Collapse>
          <FormControlLabel
            data-testid="solid.FormControlLabel"
            value={BgOptions.solid}
            control={<Radio classes={{ root: classes.MuiRadioButton }} color="primary" />}
            classes={{ root: classes.MuiFormControlLabel }}
            label={
              <Box>
                <Typography
                  data-testid="solid.LabelText"
                  className={classNames([
                    isSolid ? 'Body-Regular-Center-Chambray-Bold' : 'Body-Regular-Left-Static',
                    classes.labelTextMargin,
                  ])}
                >
                  Use a solid-color background
                </Typography>
              </Box>
            }
            onClick={handleSelectSolidPattern}
          />
        </RadioGroup>
      </Box>
    </>
  );
};

export default memo<IBackgroundOptionsProps>(BackgroundOptions);
