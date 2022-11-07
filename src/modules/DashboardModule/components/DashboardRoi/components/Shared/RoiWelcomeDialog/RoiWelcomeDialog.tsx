import React, { useEffect, useState } from 'react';
import { Button, Icon } from '@alycecom/ui';
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, Theme, Typography } from '@mui/material';
import { localStorage, useGetAcceptedGiftsCountQuery } from '@alycecom/services';

import { TRoiWelcomeMessageStorage } from '../../../utils/roiTypes';
import { birdCarryingGift } from '../../../assets';

const styles = {
  paper: { width: 702, borderRadius: '4px' },
  header: { paddingBottom: 0 },
  titleContainer: {
    m: 'auto',
    width: 'fit-content',
  },
  title: {
    fontSize: '24px',
    mt: 2,
    color: 'primary.main',
  },
  imgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: ({ spacing }: Theme) => spacing(2, 0),
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pl: 2,
    pr: 2,
  },
  firstParagraph: { color: 'primary.main' },
  secondParagraph: {
    color: 'primary.main',
    mt: 5,
  },
  parentBar: {
    height: 32,
    width: '614px',
    backgroundColor: 'grey.dark',
    borderRadius: '6px',
  },
  childBar: {
    height: '100%',
    backgroundColor: 'green.dark',
    borderRadius: '6px',
  },
  limits: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'grey.main',
    mb: 0.5,
  },
  barLabel: {
    display: 'flex',
    justifyContent: 'center',
    color: 'primary.main',
    mt: 1.5,
  },
  closeButton: {
    position: 'absolute',
    right: ({ spacing }: Theme) => spacing(2),
    top: ({ spacing }: Theme) => spacing(1.5),
    color: 'text.disabled',
  },
  button: {
    display: 'inline-block',
    minWidth: 'auto',
    padding: 0,
  },
} as const;

const RoiWelcomeDialog = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useGetAcceptedGiftsCountQuery();
  const giftsSent = data?.count;
  const minGiftsAmount = 60;
  const acceptedGiftsRatio = ((giftsSent || 0) / minGiftsAmount) * 100;
  const percentScale = acceptedGiftsRatio >= 100 ? 100 : acceptedGiftsRatio;

  useEffect(() => {
    if (isLoading || giftsSent === undefined || giftsSent >= minGiftsAmount) return undefined;

    const flagInStorage: TRoiWelcomeMessageStorage = { Key: 'roiWelcomeMessageShowed', Value: 'true' };
    const alreadyShowed = localStorage.getItem(flagInStorage.Key);
    if (alreadyShowed) return undefined;

    localStorage.setItem(flagInStorage.Key, flagInStorage.Value);
    setIsOpen(true);

    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [giftsSent, isLoading]);

  return (
    <Dialog PaperProps={{ sx: styles.paper }} maxWidth="md" open={isOpen}>
      <DialogTitle sx={styles.header}>
        <Box sx={styles.titleContainer}>
          <Typography sx={styles.title}>Welcome to Alyce</Typography>
        </Box>
        <Icon
          icon="times"
          sx={styles.closeButton}
          onClick={() => {
            setIsOpen(false);
          }}
        />
      </DialogTitle>
      <DialogContent>
        <Box sx={styles.dialogBody}>
          <DialogContentText sx={styles.firstParagraph}>
            Send <b>more gifts</b> to unlock the value of the Alyce platform!
          </DialogContentText>
          <Box sx={styles.imgWrapper}>
            <img src={birdCarryingGift} alt="Bird" />
          </Box>
          <Box>
            <Box sx={styles.limits}>
              <Box>0</Box>
              <Box>{minGiftsAmount}</Box>
            </Box>
            <Box sx={styles.parentBar}>
              <Box width={`${percentScale}%`} sx={styles.childBar}>
                &nbsp;
              </Box>
            </Box>
            <Box sx={styles.barLabel}>
              <b>{giftsSent} accepted</b>
            </Box>
          </Box>
          <DialogContentText sx={styles.secondParagraph}>
            Need help getting started? Check out our awesome{' '}
            <Button variant="text" sx={styles.button}>
              <a target="_blank" rel="noopener noreferrer" href="https://help.alyce.com/collection/386-start-here">
                Get Started Guide
              </a>
            </Button>
          </DialogContentText>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoiWelcomeDialog;
