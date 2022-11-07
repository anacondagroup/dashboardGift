import { useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import { CommonData } from '@alycecom/modules';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Icon } from '@alycecom/ui';
import { isValidImage } from '@alycecom/utils';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    width: 184,
    height: 184,
    borderColor: palette.additional.chambray10,
    borderStyle: 'solid',
    borderWidth: '1px',
    backgroundColor: '#FAFAFA',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    '&:hover $actionBox': {
      display: 'flex',
    },
  },
  actionBox: {
    display: 'none',
    position: 'absolute',
    width: '100%',
    height: '100%',
    margin: `-${spacing(1)}`,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, .82)',
    borderColor: palette.link.main,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: 5,
  },
  icon: {
    color: palette.grey.main,
    cursor: 'default !important',
  },
  flagImage: {
    flex: '0 0 18px',
    height: 18,
    borderRadius: '50%',
    display: 'inline-block',
    overflow: 'hidden',
    '& > img': {
      height: '100%',
    },
  },
}));

interface IEmptyProductCardItemProps {
  countryId: number;
  onSelectGift?: (countryId: number) => void;
}

const EmptyProductCardItem = ({ countryId, onSelectGift }: IEmptyProductCardItemProps): JSX.Element => {
  const classes = useStyles();
  const { image: flag, name: countryName } = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountryById(countryId), [countryId]),
  );
  const handleClick = useCallback(() => {
    if (onSelectGift) {
      onSelectGift(countryId);
    }
  }, [onSelectGift, countryId]);

  return (
    <Box className={classes.root}>
      <Typography>No Gift</Typography>
      <Icon fontSize={4} icon="gift" className={classes.icon} />
      <Box display="flex" mb={1} mt={1}>
        <Box className={classes.flagImage} mr={1}>
          {flag && isValidImage(flag) && <img src={flag} alt="Product country" />}
        </Box>
        <Typography className="Body-Regular-Left-Static-Bold">{countryName}</Typography>
      </Box>
      <Box className={classes.actionBox}>
        <Button onClick={handleClick} borderColor="divider" endIcon={<Icon icon="gift" />}>
          Select Gift
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyProductCardItem;
