import React, { memo, useCallback, useState, useMemo, useEffect } from 'react';
import { Avatar, Box, Chip, BoxProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { slice, reverse } from 'ramda';

import { getUserDrafts, getUserDraftsCount } from '../../store/entities/userDrafts';
import { deleteUserDraftById } from '../../store/entities/userDrafts/userDrafts.actions';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  avatar: {
    width: 20,
    height: 20,
  },
  label: {
    color: palette.primary.main,
    fontSize: 16,
  },
  chip: {
    marginRight: spacing(1 / 2),
    marginBottom: spacing(1 / 2),
  },
}));

const MAX_USER_DRAFTS_VISIBLE_COUNT = 10;

const UsersInfoList = (boxProps: BoxProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [showAll, setShowAll] = useState(true);

  const userDrafts = useSelector(getUserDrafts);
  const userDraftsCount = useSelector(getUserDraftsCount);
  const canDeleteUsers = userDraftsCount > 1;
  const isShowAllVisible = userDraftsCount > MAX_USER_DRAFTS_VISIBLE_COUNT;
  const invisibleAmount = userDraftsCount - MAX_USER_DRAFTS_VISIBLE_COUNT;
  const buttonText = showAll ? `Show less` : `Show ${invisibleAmount} more`;

  const handleDeleteUserDraft = useCallback((id: EntityId) => dispatch(deleteUserDraftById(id)), [dispatch]);

  const handleToggleMoreItems = useCallback(() => setShowAll(!showAll), [showAll]);

  const items = useMemo(() => {
    const reversedItems = reverse(userDrafts);
    return isShowAllVisible && !showAll ? slice(0, MAX_USER_DRAFTS_VISIBLE_COUNT, reversedItems) : reversedItems;
  }, [showAll, userDrafts, isShowAllVisible]);

  useEffect(() => {
    if (isShowAllVisible) {
      setShowAll(false);
    }
  }, [isShowAllVisible]);

  return (
    <Box mt={1} mb={1} {...boxProps}>
      {items.map(({ id, email }) => (
        <Chip
          key={id}
          classes={{ root: classes.chip, label: classes.label }}
          icon={<Avatar className={classes.avatar} alt="Profile Picture" src="" />}
          label={email}
          onDelete={canDeleteUsers ? () => handleDeleteUserDraft(id) : undefined}
          variant="outlined"
        />
      ))}
      {isShowAllVisible && (
        <Box width={1} textAlign="left">
          <Button onClick={handleToggleMoreItems} size="small">
            {buttonText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default memo(UsersInfoList);
