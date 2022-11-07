import React, { memo, useMemo } from 'react';
import { Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { SettingsItem } from '@alycecom/modules';
import { formatTestId, upperFirstLetter } from '@alycecom/utils';
import moment from 'moment';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  button: {
    color: palette.link.main,
    border: `1px solid ${palette.divider}`,
    backgroundColor: palette.common.white,
    boxShadow: 'none',
    width: 100,
    '&:hover': {
      backgroundColor: palette.grey.A200,
    },
  },
  chip: {
    color: palette.common.white,
    backgroundColor: palette.green.fruitSalad,
  },
}));

const IS_NEW_UNTIL_DEFAULT = '2021-06-14';

export interface IBrandingSettingsProps {
  title: string;
  description: string;
  onChange: () => void;
  isLoading?: boolean;
  brandingOwner: string | null;
  isNewUntil?: string;
}

const BrandingSettings = ({
  title,
  description,
  brandingOwner,
  isLoading = false,
  isNewUntil = IS_NEW_UNTIL_DEFAULT,
  onChange,
}: IBrandingSettingsProps): JSX.Element => {
  const classes = useStyles();

  const isBrandingNew = useMemo(() => moment().isBefore(isNewUntil), [isNewUntil]);
  const badge = isBrandingNew ? 'New' : '';
  const brandingValue = brandingOwner ? `${upperFirstLetter(brandingOwner)} branding` : 'Alyce default';

  return (
    <SettingsItem
      title={title}
      badge={badge}
      description={description}
      isLoading={isLoading}
      value={brandingValue}
      collapsible={false}
      overrideClasses={{ chip: classes.chip }}
      controls={
        <Grid item container direction="row" justifyContent="flex-end" xs={3}>
          <Button
            data-testid={`${formatTestId(title)}_BrandingSettings.Change.Button`}
            variant="contained"
            className={classes.button}
            onClick={onChange}
            disabled={isLoading}
          >
            Change
          </Button>
        </Grid>
      }
    />
  );
};

export default memo(BrandingSettings);
