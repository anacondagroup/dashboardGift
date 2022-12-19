import React, { ChangeEvent, ReactNode, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useController, useForm } from 'react-hook-form';
import { Box, Collapse, FormControl, FormControlLabel, RadioGroup, Radio, Theme, Typography } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { SectionTitleStyled, SFormLabel, CommonData } from '@alycecom/modules';

import { setGiftCodeFormat, resetCodesSettings } from '../../store/swagCampaign/steps/codes/codes.actions';
import { CodesType } from '../../store/swagCampaign/steps/codes/codes.constants';
import {
  CodesDataFields,
  CodesSettingsDataFields,
  TDigitalCodesFormValues,
  TCardsDesignFormValues,
} from '../../store/swagCampaign/steps/codes/codes.types';
import {
  digitalCodesSettingsResolver,
  digitalCodesSettingsDefaultValues,
  cardsDesignSettingsResolver,
  cardsDesignSettingsDefaultValues,
} from '../../store/swagCampaign/steps/codes/codes.schemas';
import { getCardsOrder, getGiftCodeFormat, getErrors } from '../../store/swagCampaign/steps/codes/codes.selectors';

import PhysicalCardsController from './PhysicalCardsController/PhysicalCardsController';
import DigitalCodesController from './DigitalCodesController/DigitalCodesController';

const styles = {
  textDescription: {
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

export interface ICodesFormChildrenProps {
  isDirty: boolean;
}

export interface CodesFormProps {
  children: ReactNode | ((args0: ICodesFormChildrenProps) => ReactNode);
  onSubmit: (form: TDigitalCodesFormValues, isDirty: boolean) => void;
}

const CodesForm = ({ children, onSubmit }: CodesFormProps): JSX.Element => {
  const dispatch = useDispatch();

  const giftCodeFormat = useSelector(getGiftCodeFormat);

  const printingFeeValue = useSelector(CommonData.selectors.getPrintingFeeValue);

  const codesOrder = useSelector(getCardsOrder);
  const errors = useSelector(getErrors);

  const {
    control,
    formState: { isDirty: isDigitalCodesDirty },
    handleSubmit,
    reset,
    setError,
  } = useForm<TDigitalCodesFormValues>({
    mode: 'all',
    resolver: digitalCodesSettingsResolver,
    defaultValues: digitalCodesSettingsDefaultValues,
  });

  const {
    formState: { isDirty: isPhysicalCodesDirty },
  } = useForm<TCardsDesignFormValues>({
    mode: 'all',
    resolver: cardsDesignSettingsResolver,
    defaultValues: cardsDesignSettingsDefaultValues,
  });

  const {
    field: { onChange },
  } = useController({
    name: CodesSettingsDataFields.CodeFormat,
    control,
  });

  const isDirty = giftCodeFormat === CodesType.Digital ? isDigitalCodesDirty : isPhysicalCodesDirty;

  const handleChangeGiftCodeFormat = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
      dispatch(resetCodesSettings());
      dispatch(setGiftCodeFormat(event.target.value));
    },
    [onChange, dispatch],
  );

  const submitHandler = (form: TDigitalCodesFormValues) => {
    onSubmit(form, isDirty);
  };

  useEffect(() => {
    if (codesOrder && giftCodeFormat === CodesType.Digital) {
      reset(codesOrder, { keepDefaultValues: false });
    }
  }, [codesOrder, giftCodeFormat, reset]);

  useApplyManualFormErrorsEffect<TDigitalCodesFormValues>(setError, errors);

  return (
    <Box component="form" display="flex" flexDirection="column" onSubmit={handleSubmit(submitHandler)}>
      <Box flex="1 1 auto" mb={20}>
        <Box>
          <SectionTitleStyled>Gift Code Format</SectionTitleStyled>
        </Box>
        <Box mt={2} mb={2}>
          <SFormLabel>How do you want to provide gift codes to recipients?</SFormLabel>
        </Box>
        <FormControl>
          <RadioGroup
            name={`${CodesDataFields.TypeCodes}`}
            value={giftCodeFormat}
            onChange={handleChangeGiftCodeFormat}
          >
            <FormControlLabel value={CodesType.Physical} control={<Radio color="primary" />} label="Physical cards" />
            <Box ml={4}>
              <Box>
                <Typography sx={styles.textDescription}>
                  Alyce has partnered with MOO cards to print your customize gift redemption cards. Printing usually
                  takes
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.textDescription}>
                  10-14 business days.&nbsp;
                  <span>
                    <b>
                      Upon ordering, you will be charged ${printingFeeValue} per card for printing and shipping costs.
                    </b>
                  </span>
                </Typography>
              </Box>
            </Box>
            <Box ml={4} mt={2}>
              <Collapse in={giftCodeFormat === CodesType.Physical} unmountOnExit mountOnEnter>
                <PhysicalCardsController />
              </Collapse>
            </Box>
            <FormControlLabel value={CodesType.Digital} control={<Radio color="primary" />} label="Digital codes" />
            <Box ml={4} mt={2}>
              <Typography sx={styles.textDescription}>Download a XLSX file with your codes</Typography>
              <Collapse in={giftCodeFormat === CodesType.Digital} unmountOnExit mountOnEnter>
                <DigitalCodesController control={control} />
              </Collapse>
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
      {typeof children === 'function' ? children({ isDirty }) : children}
    </Box>
  );
};

export default CodesForm;
