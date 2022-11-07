import { getArchiveAvailabilityOptions } from './campaignsManagement.helpers';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../constants/campaignSettings.constants';

describe('campaignsManagementHelpers', () => {
  describe('getArchiveAvailabilityOptions', () => {
    test('Should be enabled for Activate', () => {
      expect(
        getArchiveAvailabilityOptions({
          campaigns: [{ type: CAMPAIGN_TYPES.ACTIVATE, status: CAMPAIGN_STATUS.ACTIVE }],
          hasPermission: true,
          tooltip: 'Only 1:many and Personal gifting campaigns are allowed for Archiving',
        }),
      ).toEqual({
        hidden: false,
        disabled: false,
        tooltip: 'Only 1:many and Personal gifting campaigns are allowed for Archiving',
      });
    });

    test('Should be enabled for Activate + Swag', () => {
      expect(
        getArchiveAvailabilityOptions({
          campaigns: [
            { type: CAMPAIGN_TYPES.ACTIVATE, status: CAMPAIGN_STATUS.ACTIVE },
            { type: CAMPAIGN_TYPES.SWAG, status: CAMPAIGN_STATUS.ACTIVE },
          ],
          hasPermission: true,
        }),
      ).toEqual({
        hidden: false,
        disabled: false,
      });
    });

    test('Should be enabled for Activate + Standard', () => {
      expect(
        getArchiveAvailabilityOptions({
          campaigns: [
            { type: CAMPAIGN_TYPES.ACTIVATE, status: CAMPAIGN_STATUS.ACTIVE },
            { type: CAMPAIGN_TYPES.STANDARD, status: CAMPAIGN_STATUS.ACTIVE },
          ],
          hasPermission: true,
        }),
      ).toEqual({
        hidden: false,
        disabled: false,
      });
    });

    test('Should be disabled for Activate + Standard.Archived', () => {
      expect(
        getArchiveAvailabilityOptions({
          campaigns: [
            { type: CAMPAIGN_TYPES.ACTIVATE, status: CAMPAIGN_STATUS.ACTIVE },
            { type: CAMPAIGN_TYPES.STANDARD, status: CAMPAIGN_STATUS.ARCHIVED },
          ],
          hasPermission: true,
          tooltip: 'Only 1:many and Personal gifting campaigns are allowed for Archiving',
        }),
      ).toEqual({
        hidden: true,
        disabled: true,
        tooltip: 'Only 1:many and Personal gifting campaigns are allowed for Archiving',
      });
    });
  });
});
