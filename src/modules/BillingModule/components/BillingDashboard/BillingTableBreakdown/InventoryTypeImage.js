import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }) => ({
  inventoryImageBox: {
    width: 32,
    height: 1,
    marginRight: spacing(1),
    float: 'left',
  },
  inventoryImage: {
    height: 32,
    margin: '-5px 0',
    maxWidth: 32,
  },
}));

const InventoryTypeImage = ({ src }) => {
  const classes = useStyles();

  return (
    <Box className={classes.inventoryImageBox}>
      {src && <img src={src} alt="" className={classes.inventoryImage} />}
    </Box>
  );
};

InventoryTypeImage.propTypes = {
  src: PropTypes.string,
};

InventoryTypeImage.defaultProps = {
  src: undefined,
};

export default memo(InventoryTypeImage);
