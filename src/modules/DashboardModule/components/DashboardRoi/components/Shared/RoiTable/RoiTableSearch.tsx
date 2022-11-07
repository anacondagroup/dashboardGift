import React, { useRef, useState } from 'react';
import { SearchField } from '@alycecom/ui';
import { useDebounce } from 'react-use';

const styles = {
  searchField: {
    width: 510,
  },
} as const;

export interface IRoiTableSearchProps {
  placeholder: string;
  onChange: (search: string) => void;
  debounce?: number;
}

const RoiTableSearch = ({ placeholder, debounce = 500, onChange }: IRoiTableSearchProps): JSX.Element => {
  const isMountRef = useRef(false);
  const [search, setSearch] = useState('');

  useDebounce(
    () => {
      if (isMountRef.current) {
        onChange(search);
      }
      isMountRef.current = true;
    },
    debounce,
    [search, onChange],
  );

  return (
    <SearchField
      placeholder={placeholder}
      value={search}
      onChange={e => setSearch(e.target.value)}
      sx={styles.searchField}
    />
  );
};

export default RoiTableSearch;
