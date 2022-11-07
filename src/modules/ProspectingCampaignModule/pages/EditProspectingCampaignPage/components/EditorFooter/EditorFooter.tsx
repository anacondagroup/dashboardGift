import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, ButtonBase, CircularProgress, Theme } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';

import { EDITOR_FOOTER_PORTAL_PLACEMENT_ID } from '../../../../constants/ids';

const styles = {
  hiddenButton: {
    display: 'none',
  },
  footerRoot: {
    height: 82,
  },
  footer: {
    zIndex: ({ zIndex }: Theme) => zIndex.appBar,
    boxShadow: ({ palette }: Theme) => `0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 ${palette.grey.main}`,
    backgroundColor: ({ palette }: Theme) => palette.green.fruitSalad20,
    height: 82,
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    px: 6,
  },
} as const;

export interface IEditorFooterProps {
  disabled?: boolean;
  loading?: boolean;
}

const EditorFooter = ({ disabled = false, loading = false }: IEditorFooterProps): JSX.Element => {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!portalNode) {
      timer = setInterval(() => {
        setPortalNode(document.getElementById(EDITOR_FOOTER_PORTAL_PLACEMENT_ID));
      }, 100);
    }

    return () => {
      clearInterval(timer);
    };
  }, [portalNode]);

  const handleSubmit = () => {
    submitButtonRef.current?.click();
  };

  const footer = (
    <Box sx={styles.footerRoot}>
      <Box sx={styles.footer}>
        <Button
          disabled={disabled || loading}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress color="inherit" size={15} /> : <Icon icon="save" />}
        >
          Save
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <ButtonBase ref={submitButtonRef} sx={styles.hiddenButton} type="submit" />
      {!portalNode && footer}
      {portalNode && createPortal(footer, portalNode)}
    </>
  );
};

export default EditorFooter;
