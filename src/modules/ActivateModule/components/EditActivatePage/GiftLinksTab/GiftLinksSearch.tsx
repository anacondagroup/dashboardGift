import React, { ChangeEvent, useRef, useState, memo } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Icon } from '@alycecom/ui';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'react-use';

import { setSearchFilter } from '../../../store/entities/giftLinks/giftLinks.actions';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  clearBtn: {
    minWidth: 'auto',
    color: palette.text.primary,
  },
}));

const GiftLinksSearch = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMountRef = useRef(false);
  const [search, setSearch] = useState('');

  useDebounce(
    () => {
      if (isMountRef.current) {
        dispatch(setSearchFilter(search));
      }
      isMountRef.current = true;
    },
    300,
    [search, dispatch],
  );

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  return (
    <TextField
      variant="outlined"
      label="Search team members"
      value={search}
      fullWidth
      onChange={handleChangeSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon color="grey.main" icon="search" />
          </InputAdornment>
        ),
        endAdornment: search && (
          <InputAdornment position="end">
            <Button
              onClick={() => {
                setSearch('');
              }}
              className={classes.clearBtn}
              size="small"
              variant="text"
            >
              <Icon icon="times" />
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default memo(GiftLinksSearch);
