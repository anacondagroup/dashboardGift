import React, { memo, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { Icon } from '@alycecom/ui';

import alyceLogo from '../../../../../../../../assets/images/alyce-logo-bird-full-color.svg';

interface ILogosSectionProps {
  integratedAppLogoSrc: string;
  appToAlyce?: boolean;
}

const styles = {
  caret: {
    cursor: 'unset',
  },
  logo: {
    objectFit: 'contain',
  },
} as const;

const LogosSection = ({ integratedAppLogoSrc, appToAlyce }: ILogosSectionProps): JSX.Element => {
  const firstIconSrc = useMemo(() => (appToAlyce ? integratedAppLogoSrc : alyceLogo), [
    appToAlyce,
    integratedAppLogoSrc,
  ]);
  const secondIconSrc = useMemo(() => (appToAlyce ? alyceLogo : integratedAppLogoSrc), [
    appToAlyce,
    integratedAppLogoSrc,
  ]);

  return (
    <Box width={150}>
      <Grid container direction="column">
        <Grid item container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box
              component="img"
              width={45}
              height={45}
              sx={styles.logo}
              src={firstIconSrc}
              alt="contributor-app-logo"
            />
          </Grid>
          <Grid item>
            <Icon icon="caret-right" sx={styles.caret} color="grey.main" />
          </Grid>
          <Grid item xs={5}>
            <Box component="img" width={45} height={45} sx={styles.logo} src={secondIconSrc} alt="recipient-app-logo" />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(LogosSection);
