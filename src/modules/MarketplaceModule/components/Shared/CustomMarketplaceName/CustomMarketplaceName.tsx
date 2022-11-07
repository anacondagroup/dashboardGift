import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getIsLoaded,
  getIsLoading,
  makeGetCustomMarketplaceById,
} from '../../../store/entities/customMarketplaces/customMarketplaces.selectors';
import { fetchCustomMarketplaces } from '../../../store/entities/customMarketplaces/customMarketplaces.actions';

export interface ICustomMarketplaceNameProps {
  id: number;
}

const CustomMarketplaceName = ({ id }: ICustomMarketplaceNameProps): string => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const isLoaded = useSelector(getIsLoaded);

  const marketplace = useSelector(useMemo(() => makeGetCustomMarketplaceById(id), [id]));

  useEffect(() => {
    if (!isLoading && !isLoaded) {
      dispatch(fetchCustomMarketplaces());
    }
  }, [dispatch, isLoading, isLoaded]);

  return marketplace?.name ?? '';
};

export default CustomMarketplaceName;
