import React, { useState } from 'react';
import { SearchField } from '@alycecom/ui';
import { useDebounce } from 'react-use';

import { TCustomTableSetValues } from './useCustomTable';

interface ICustomTableToolbarPropTypes {
  placeholder: string;
  search: string;
  setValues: TCustomTableSetValues;
  debounce?: number;
}

const CustomTableToolbar = ({
  placeholder,
  search,
  setValues,
  debounce = 500,
}: ICustomTableToolbarPropTypes): JSX.Element => {
  const [searchValue, setSearchValue] = useState(search);

  useDebounce(
    () => {
      setValues({
        search: searchValue,
        currentPage: 1,
      });
    },
    debounce,
    [searchValue, setValues],
  );

  return (
    <SearchField
      placeholder={placeholder}
      value={searchValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
    />
  );
};

export default CustomTableToolbar;
