import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { waitForBulkImport, waitForBulkImportCancel } from '../../../../store/bulkCreateContacts/import/import.actions';
import { getBulkImportId, getBulkImportStatus } from '../../../../store/bulkCreateContacts/import/import.selectors';

import AwaitingProcess from './AwaitingProcess';
import FinishingProcess from './FinishingProcess';

const ImportingProcess = ({ onClose }) => {
  const dispatch = useDispatch();
  const importId = useSelector(getBulkImportId);
  const status = useSelector(getBulkImportStatus);

  useEffect(() => {
    dispatch(waitForBulkImport(importId));

    return () => {
      dispatch(waitForBulkImportCancel());
    };
  }, [dispatch, importId]);

  return (
    <>
      {['awaiting', 'in_progress'].includes(status) && <AwaitingProcess onClose={onClose} />}
      {status === 'finished' && <FinishingProcess onClose={onClose} />}
    </>
  );
};

ImportingProcess.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ImportingProcess;
