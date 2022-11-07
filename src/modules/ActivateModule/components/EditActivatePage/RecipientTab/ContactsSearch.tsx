import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { SearchField, TSearchFieldProps } from '@alycecom/ui';

type TContactsSearchProps = Omit<TSearchFieldProps, 'onChange' | 'placeholder'> & {
  onChange: (search: string) => void;
};

const ContactsSearch = ({ onChange, ...searchFieldProps }: TContactsSearchProps): JSX.Element => {
  const [search, setSearch] = useState('');

  useDebounce(
    () => {
      onChange(search);
    },
    500,
    [onChange, search],
  );

  return (
    <SearchField
      {...searchFieldProps}
      placeholder="Search recipients"
      value={search}
      onChange={({ target }) => setSearch(target.value)}
    />
  );
};

export default ContactsSearch;
