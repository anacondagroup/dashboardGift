import React, { memo } from 'react';
import { Box, Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Icon } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { useModalState } from '@alycecom/hooks';
import { Link } from 'react-router-dom';

import { useCustomMarketplace } from '../../hooks/useCustomMarketplace';
import { MarketplaceMode } from '../../types';
import { getIsUserCanEditMarketplace } from '../../store/customMarketplace/customMarketplace.selectors';
import { CustomMarketplaceSidebar } from '../CustomMarketplaceSidebar';
import { MarketplaceUsages } from '../MarketplaceUsages';
import { MARKETPLACE_ROUTES } from '../../routePaths';
import { useTrackCustomMarketplaceModeChanged } from '../../hooks/useTrackCustomMarketplace';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    transition: 'background 225ms ease-in 0ms',
    padding: spacing(0, 2),
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 1240,
    padding: spacing(3, 0, 3),
    margin: spacing(0, 'auto'),
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    color: palette.primary.main,
    fontSize: '2rem',
    lineHeight: '2.5rem',
    fontWeight: 700,
  },
  editNote: {
    color: palette.primary.main,
    fontStyle: 'italic',
    fontSize: '0.875rem',
  },
}));

const CustomMarketplaceHeader = (): JSX.Element | null => {
  const classes = useStyles();
  const { marketplaceId, isEdit, setMode } = useCustomMarketplace();
  const isCanEditMarketplace = useSelector(getIsUserCanEditMarketplace);

  const { isOpen, handleOpen, handleClose } = useModalState();
  const trackModeChanged = useTrackCustomMarketplaceModeChanged();

  if (!marketplaceId) {
    return null;
  }

  const handleClickEditProducts = () => {
    setMode(MarketplaceMode.Edit);
    trackModeChanged(MarketplaceMode.Edit);
  };

  return (
    <>
      <Box className={classes.root} bgcolor={isEdit ? 'primary.superLight' : 'grey.dark'}>
        <Box className={classes.container}>
          <Box>
            <Box mb={1}>
              <Link to={MARKETPLACE_ROUTES.SHARED_PATH}>&lt; Back to all Marketplaces</Link>
            </Box>
            <Box display="flex" alignItems="flex-end">
              <Box mr={2} className={classes.title}>
                {isEdit ? 'Edit ' : 'Preview '}
                Marketplace
              </Box>
              <Fade in={isCanEditMarketplace} unmountOnExit>
                <div>
                  {!isEdit && (
                    <Button color="primary" onClick={handleClickEditProducts} startIcon={<Icon icon="pencil-alt" />}>
                      Edit Marketplace
                    </Button>
                  )}
                  {isEdit && (
                    <Button onClick={handleOpen} startIcon={<Icon icon="pencil-alt" />}>
                      Edit Settings
                    </Button>
                  )}
                </div>
              </Fade>
              <Fade in={isCanEditMarketplace} mountOnEnter unmountOnExit>
                <div>
                  <Box ml={2}>
                    <MarketplaceUsages />
                  </Box>
                </div>
              </Fade>
            </Box>
          </Box>
          <Fade in={isEdit} unmountOnExit mountOnEnter>
            <div>
              <Box display="flex" alignItems="flex-end" className={classes.editNote}>
                All gift selections are saved automatically
              </Box>
            </div>
          </Fade>
        </Box>
      </Box>
      <CustomMarketplaceSidebar isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default memo(CustomMarketplaceHeader);
