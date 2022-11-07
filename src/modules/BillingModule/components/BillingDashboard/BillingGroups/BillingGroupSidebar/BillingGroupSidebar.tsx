import React, { useCallback, memo } from 'react';
import { ProductSidebar } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { BillingGroupForm } from '../BillingGroupForm';
import { getIsModalOpen, getBillingGroupData } from '../../../../store/editBillingGroups/editBillingGroups.selectors';
import { setModalOpen } from '../../../../store/editBillingGroups/editBillingGroups.actions';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';

const BillingGroupSidebar = () => {
  const isModalOpen = useSelector(getIsModalOpen);
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();
  const billingGroupData = useSelector(getBillingGroupData);

  const handleClose = useCallback(() => {
    dispatch(setModalOpen(false));
    const trackMessage = billingGroupData.groupId ? 'Edit' : 'Create';
    trackEvent(`Manage Billing - BillingGroups - Modal Close ${trackMessage} Billing Group By X`);
  }, [dispatch, trackEvent, billingGroupData]);

  return (
    <ProductSidebar isOpen={isModalOpen} onClose={handleClose}>
      <BillingGroupForm />
    </ProductSidebar>
  );
};

export default memo(BillingGroupSidebar);
