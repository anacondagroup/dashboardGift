import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SettingsItem } from '@alycecom/modules';
import { fakeItemsFactory } from '@alycecom/utils';
import { ActionButton } from '@alycecom/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { number, object, array, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  swagDigitalCodesGenerateFlowWizardRequest,
  swagDigitalUpdateBatchesRequest,
} from '../../../../store/campaign/swagDigitalCodes/swagDigitalCodes.actions';
import {
  createCampaignSidebarAddSwagDigitalCodes,
  createCampaignSidebarAddSwagPhysicalCodes,
} from '../../../../store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import { getSwagBatchesSettings } from '../../../../store/campaign/swagBatches/swagBatches.selectors';
import {
  swagCodesBatchesUpdatingStart,
  swagCodesSettingsAllSettingsRequest,
} from '../../../../store/campaign/swagBatches/swagBatches.actions';
import { getStateUpdatedTimeState } from '../../../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';
import { SWAG_DIGITAL, SWAG_PHYSICAL } from '../../../../../../constants/swagSelect.constants';
import { swagPhysicalCodesGenerateFlowWizardRequest } from '../../../../store/campaign/swagPhysicalCodes/swagPhysicalCodes.actions';
import { getGeneralSettingsBatchOwners } from '../../../../store/campaign/batchOwners/batchOwners.selectors';
import {
  generalSettingsClearBatchOwnersData,
  loadGeneralSettingsBatchOwnersRequest,
} from '../../../../store/campaign/batchOwners/batchOwners.actions';

import SwagCodesInventoryRow from './SwagCodesInventoryRow';

const useStyle = makeStyles(() => ({
  button: {
    boxShadow: 'none',
  },
}));

const BATCH_NAME_COL = 'order name';
const CODES_CREATED_COL = 'codes created';
const CODES_CLAIMED_COL = 'codes claimed';
const CREATION_DATE_COL = 'creation date';
const EXPIRATION_DATE_COL = 'expiration date';
const BATCH_OWNER_COL = 'order owner';

const sortBy = (column, dir) => {
  const direction = dir === 'asc' ? R.ascend : R.descend;
  let sortedValue;
  switch (column) {
    case CODES_CREATED_COL:
      sortedValue = R.prop('codesCreated');
      break;
    case CODES_CLAIMED_COL:
      sortedValue = R.prop('codesClaimed');
      break;
    case CREATION_DATE_COL:
      sortedValue = R.prop('creationDate');
      break;
    case EXPIRATION_DATE_COL:
      sortedValue = R.prop('expirationDate');
      break;
    case BATCH_OWNER_COL:
      sortedValue = R.path(['batchOwner', 'fullName']);
      break;
    default:
      sortedValue = R.prop(column);
  }
  return R.sort(direction(sortedValue));
};

const validationSchema = object().shape({
  batches: array()
    .required()
    .of(
      object().shape({
        name: string().trim().label('Field').required('Field is required').min(3).max(20),
        ownerId: number().required(),
        expirationDate: string().required(),
      }),
    ),
});

const SwagCodesInventory = ({ campaignId, campaignName, campaignType }) => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const { isLoading, codeInventory: batches, teamId } = useSelector(getSwagBatchesSettings);
  const forceUpdate = useSelector(getStateUpdatedTimeState);
  const { members: teamMembers } = useSelector(getGeneralSettingsBatchOwners);

  const formMethods = useForm({ mode: 'all', resolver: yupResolver(validationSchema) });
  const {
    reset,
    formState: { isValid },
    getValues,
  } = formMethods;

  const [sortDir, setSortDir] = useState('asc');
  const [sortColumn, setSortColumn] = useState(CODES_CREATED_COL);

  const items = useMemo(
    () => (isLoading ? fakeItemsFactory(batches, isLoading, id => ({ id }), 3) : sortBy(sortColumn, sortDir)(batches)),
    [isLoading, batches, sortDir, sortColumn],
  );

  const description = useMemo(() => {
    if (!isLoading && batches && batches.length) {
      const sortedBatches = batches.sort((left, right) =>
        moment(left.creationDate).isAfter(moment(right.creationDate)) ? -1 : 1,
      );
      const codesInBatch = sortedBatches[0].codesCreated;
      const createdDate = moment(sortedBatches[0].creationDate).format('L');

      return `${campaignName} latest code details are ${codesInBatch} codes generated on ${createdDate}`;
    }
    return '';
  }, [campaignName, batches, isLoading]);

  useEffect(() => {
    dispatch(swagCodesSettingsAllSettingsRequest(campaignId));
    dispatch(loadGeneralSettingsBatchOwnersRequest(campaignId));

    return () => {
      dispatch(generalSettingsClearBatchOwnersData());
    };
  }, [campaignId, dispatch, forceUpdate]);

  useEffect(() => {
    if (!isLoading) {
      const batchValues = items.map(batch => ({
        name: batch.name,
        ownerId: batch.batchOwner.id,
        expirationDate: batch.expirationDate,
      }));
      reset({
        batches: batchValues,
      });
    }
  }, [items, isLoading, reset]);

  const onSort = useCallback(
    column => {
      if (sortColumn !== column) {
        setSortColumn(column);
        setSortDir('asc');
      } else {
        const dir = sortDir === 'desc' ? 'asc' : 'desc';
        setSortDir(dir);
      }
    },
    [sortDir, sortColumn, setSortDir, setSortColumn],
  );

  const handleGenerateMoreCodes = useCallback(() => {
    if (campaignType === SWAG_DIGITAL) {
      dispatch(createCampaignSidebarAddSwagDigitalCodes());
      dispatch(swagDigitalCodesGenerateFlowWizardRequest({ campaignId, teamId }));
    }
    if (campaignType === SWAG_PHYSICAL) {
      dispatch(createCampaignSidebarAddSwagPhysicalCodes());
      dispatch(swagPhysicalCodesGenerateFlowWizardRequest({ campaignId, teamId }));
    }
  }, [campaignId, campaignType, teamId, dispatch]);

  const handleSaveChanges = useCallback(() => {
    const batchValues = getValues().batches;
    dispatch(
      swagDigitalUpdateBatchesRequest({
        campaignId,
        data: batchValues.map((batch, index) => ({
          batchId: batches[index].id,
          batchName: batch.name,
          expirationDate: moment(batch.expirationDate).format('YYYY-MM-DD'),
          batchOwnerId: batch.ownerId,
        })),
      }),
    );
    dispatch(swagCodesBatchesUpdatingStart());
  }, [dispatch, campaignId, getValues, batches]);

  return (
    <FormProvider {...formMethods}>
      <SettingsItem
        title="Code inventory"
        description={`Keep track of the codes you’ve generated and generate more codes here. ${description}`}
        isLoading={isLoading}
        collapsible={false}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">{BATCH_NAME_COL}</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  direction={sortDir}
                  active={sortColumn === CODES_CREATED_COL}
                  onClick={() => onSort(CODES_CREATED_COL)}
                >
                  {CODES_CREATED_COL}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  direction={sortDir}
                  active={sortColumn === CODES_CLAIMED_COL}
                  onClick={() => onSort(CODES_CLAIMED_COL)}
                >
                  {CODES_CLAIMED_COL}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  direction={sortDir}
                  active={sortColumn === CREATION_DATE_COL}
                  onClick={() => onSort(CREATION_DATE_COL)}
                >
                  {CREATION_DATE_COL}
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">
                <TableSortLabel
                  direction={sortDir}
                  active={sortColumn === EXPIRATION_DATE_COL}
                  onClick={() => onSort(EXPIRATION_DATE_COL)}
                >
                  {EXPIRATION_DATE_COL}
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">
                <TableSortLabel
                  direction={sortDir}
                  active={sortColumn === BATCH_OWNER_COL}
                  onClick={() => onSort(BATCH_OWNER_COL)}
                >
                  {BATCH_OWNER_COL}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((batch, index) => (
              <SwagCodesInventoryRow
                key={batch.id}
                index={index}
                batch={batch}
                isLoading={isLoading}
                teamMembers={teamMembers}
              />
            ))}
          </TableBody>
        </Table>
        <Box mt={2} display="flex" justifyContent="flex-start" alignItems="center">
          <ActionButton width={190} onClick={handleSaveChanges} disabled={!isValid}>
            Save changes
          </ActionButton>
        </Box>
        <Box width="290px" mt={6} display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleGenerateMoreCodes}
            fullWidth
          >
            Generate more{campaignType.includes('digital') ? ' codes' : ' cards'}
          </Button>
        </Box>
      </SettingsItem>
    </FormProvider>
  );
};

SwagCodesInventory.propTypes = {
  campaignName: PropTypes.string.isRequired,
  campaignId: PropTypes.number.isRequired,
  campaignType: PropTypes.string.isRequired,
};

export default SwagCodesInventory;
