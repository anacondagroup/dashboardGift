import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CommonData } from '@alycecom/modules';
import classNames from 'classnames';
import { AlyceTheme, Tooltip } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  countries: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
  },
  tooltip: {
    backgroundColor: palette.common.white,
    color: palette.text.primary,
    padding: spacing(1.75, 2),
    maxWidth: 150,
    fontSize: 16,
    lineHeight: 1.5,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.25)',
    fontWeight: 'normal',
  },
}));

export interface ICampaignCountriesProps {
  countryIds: number[];
}

const CampaignCountries = ({ countryIds }: ICampaignCountriesProps) => {
  const classes = useStyles();

  const countries = useSelector(useMemo(() => CommonData.selectors.makeGetCountriesByIds(countryIds), [countryIds]));

  const countriesNames = useMemo(() => countries.map(country => country.name), [countries]);

  return (
    <Tooltip
      title={
        <>
          {countriesNames.map(name => (
            <Typography key={name}>{name}</Typography>
          ))}
        </>
      }
      placement="top"
      arrow
      classes={{ tooltip: classes.tooltip }}
    >
      <Typography className={classNames('Body-Small-Inactive', classes.countries)}>
        {countriesNames.join(', ')}
      </Typography>
    </Tooltip>
  );
};

export default memo(CampaignCountries);
