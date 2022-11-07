import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';

import { theme } from '../../../../../../styles/alyce-theme';

import GiftBreakdownTableRow from './GiftBreakdownTableRow';

const mockedItem = {
  id: 1,
  acceptedGift: 'Product',
  batchName: 'Batch',
  giftStatus: 'accepted',
  recipient: {
    id: 2,
    fullName: 'Full Name',
  },
};
const columns = [
  {
    name: 'Column 1',
    field: 'recipient.fullName',
  },
  {
    name: 'Column 2',
    field: 'acceptedGift',
  },
  {
    name: 'Column 3',
    field: 'batchName',
    getValue: data => `${data.acceptedGift} in ${data.batchName}`,
  },
  {
    name: 'Column 4',
    field: 'giftStatus',
    formatValue: value => value.toUpperCase(),
  },
];

describe('GiftBreakdownTableRow', () => {
  const setup = props =>
    render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <GiftBreakdownTableRow item={mockedItem} isLoading={false} columns={columns} {...props} />
        </ThemeProvider>
      </StyledEngineProvider>,
    );

  it('Should render all columns in render state if isLoading is true', () => {
    const { queryByText } = setup({ isLoading: true, item: { id: 1 } });

    expect(queryByText(mockedItem.recipient.fullName)).not.toBeInTheDocument();
    expect(queryByText(mockedItem.acceptedGift)).not.toBeInTheDocument();
    expect(queryByText('Product in Batch')).not.toBeInTheDocument();
    expect(queryByText('ACCEPTED')).not.toBeInTheDocument();
  });

  it('Should render columns', () => {
    const { getByText } = setup();

    expect(getByText(mockedItem.recipient.fullName)).toBeInTheDocument();
    expect(getByText(mockedItem.acceptedGift)).toBeInTheDocument();
    expect(getByText('Product in Batch')).toBeInTheDocument();
    expect(getByText('ACCEPTED')).toBeInTheDocument();
  });
});
