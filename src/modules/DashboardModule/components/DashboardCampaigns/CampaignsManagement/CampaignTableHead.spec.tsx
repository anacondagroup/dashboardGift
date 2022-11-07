import React from 'react';

import { render, screen, userEvent } from '../../../../../testUtils';
import CampaignTableHead, { ICampaignTableHeadProps } from './CampaignTableHead';
import { TABLE_SORT } from '../../../../../components/Shared/CustomTable/customTable.constants';
import { ICustomTableColumn, IRowDataItem } from '../../../../../components/Shared/CustomTable/CustomTable.types';

describe('CampaignTableHead', () => {
  const setup = (props: Partial<ICampaignTableHeadProps<IRowDataItem>>) =>
    render(
      <CampaignTableHead
        columns={[
          { name: 'Campaign name', field: 'name' },
          { name: 'Type', field: 'type' },
          { name: 'Team', field: 'team' },
          { name: 'Gifts sent', field: 'giftsSent' },
          { name: 'Gifts viewed', field: 'giftsViewed' },
        ]}
        sortDirection={TABLE_SORT.ASC}
        onSortChange={() => {}}
        pageCount={5}
        pageSelectedCount={0}
        selectedTotal={0}
        onToggleSelectAll={() => {}}
        onResetSelection={() => {}}
        isLoading={false}
        {...props}
      />,
    );

  describe('Select all', () => {
    const getCheckbox = () => screen.getByTestId('CampaignsManagement.SelectAll').children[0];

    test('Should select all when clicked on unchecked', () => {
      const onToggleSelectAll = jest.fn();
      setup({ onToggleSelectAll });

      expect(getCheckbox()).not.toBeChecked();
      expect(getCheckbox()).toHaveAttribute('data-indeterminate', 'false');

      userEvent.click(getCheckbox());

      expect(onToggleSelectAll).toBeCalledWith(true);
    });

    test('Should select all when clicked on indeterminate', () => {
      const onToggleSelectAll = jest.fn();
      const selectedTotal = 5;
      const pageSelectedCount = 0;
      setup({ onToggleSelectAll, selectedTotal, pageSelectedCount });

      expect(getCheckbox()).toHaveAttribute('data-indeterminate', 'true');

      userEvent.click(getCheckbox());

      expect(onToggleSelectAll).toBeCalledWith(true);
    });

    test('Should clear selection when clicked on indeterminate on empty page', () => {
      const onToggleSelectAll = jest.fn();
      const onResetSelection = jest.fn();
      const selectedTotal = 5;
      const pageSelectedCount = 0;
      const pageCount = 0;
      const columns: ICustomTableColumn<IRowDataItem>[] = [];
      setup({ onToggleSelectAll, onResetSelection, selectedTotal, pageSelectedCount, pageCount, columns });

      expect(getCheckbox()).toHaveAttribute('data-indeterminate', 'true');

      userEvent.click(getCheckbox());

      expect(onToggleSelectAll).not.toBeCalled();
      expect(onResetSelection).toBeCalledWith();
    });

    test('Should disable checkbox when page empty and nothing selected', () => {
      const onToggleSelectAll = jest.fn();
      const selectedTotal = 0;
      const pageSelectedCount = 0;
      const pageCount = 0;
      const columns: ICustomTableColumn<IRowDataItem>[] = [];
      setup({ onToggleSelectAll, selectedTotal, pageSelectedCount, pageCount, columns });

      expect(getCheckbox()).toBeDisabled();
    });
  });
});
