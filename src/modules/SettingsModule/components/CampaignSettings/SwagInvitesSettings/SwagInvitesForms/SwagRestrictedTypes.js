import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  TableContainer,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { fakeItemsFactory } from '@alycecom/utils';
import { DashboardIcon, SelectFilter, ActionButton, TableLoadingLabel } from '@alycecom/ui';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: 500,
  },
  tableHeaderCell: {
    backgroundColor: 'white',
  },
  button: {
    boxShadow: 'none',
    width: 155,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  defaultProductId: {
    backgroundColor: theme.palette.green.fruitSaladLight,
  },
  textButton: {
    cursor: 'pointer',
    fontSize: 12,
    color: theme.palette.grey.main,
    whiteSpace: 'normal',
    textOverflow: 'unset',
    marginRight: -16,
  },
}));

const sortBy = (column, dir) => {
  const direction = dir === 'asc' ? R.ascend : R.descend;
  let sortedValue;
  switch (column) {
    case 'name':
      sortedValue = R.prop('name');
      break;
    case 'price':
      sortedValue = R.prop('price');
      break;
    default:
      sortedValue = R.prop(column);
  }
  return R.sort(direction(sortedValue));
};

const SwagRestrictedTypes = ({ productTypes, isLoading, onSave, defaultProduct, restrictedProducts }) => {
  const classes = useStyles();
  const [defaultProductId, setDefaultProductId] = useState(defaultProduct);
  const [allProducts, setAllProducts] = useState(productTypes);
  const [restrictedProductIds, setRestrictedProductIds] = useState([...restrictedProducts]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');
  const [search, setSearch] = useState('');
  const [filterId, setFilterId] = useState('ALL');
  const [hoveredGift, setHoveredGift] = useState(0);

  const filterMenu = useMemo(
    () => [
      { id: 'ALL', text: `View all swag products (${allProducts.length})` },
      { id: 'AVAILABLE', text: `View available products (${allProducts.length - restrictedProductIds.length})` },
      { id: 'RESTRICTED', text: `View restricted products (${restrictedProductIds.length})` },
    ],
    [restrictedProductIds, allProducts],
  );
  const onFilterChange = useCallback(({ sort: filter }) => setFilterId(filter), []);

  useEffect(() => {
    setAllProducts([...productTypes]);
  }, [productTypes]);
  useEffect(() => {
    setRestrictedProductIds([...restrictedProducts]);
  }, [restrictedProducts]);
  const onSort = useCallback(
    column => {
      if (sortColumn !== column) {
        setSortColumn(column);
        setSortDirection('asc');
      } else {
        const dir = sortDirection === 'desc' ? 'asc' : 'desc';
        setSortDirection(dir);
      }
    },
    [sortDirection, sortColumn, setSortDirection, setSortColumn],
  );

  const handleCheckBox = useCallback(
    id => {
      if (restrictedProductIds.indexOf(id) >= 0) {
        setRestrictedProductIds(restrictedProductIds.filter(productId => productId !== id));
        return;
      }
      setRestrictedProductIds([...restrictedProductIds, id]);
    },
    [restrictedProductIds, setRestrictedProductIds],
  );

  const products = useMemo(() => {
    if (!isLoading) {
      let filteredProducts;
      switch (filterId) {
        case 'AVAILABLE':
          filteredProducts = allProducts.filter(item => restrictedProductIds.indexOf(item.id) < 0);
          break;
        case 'RESTRICTED':
          filteredProducts = allProducts.filter(item => restrictedProductIds.indexOf(item.id) >= 0);
          break;
        default:
          filteredProducts = allProducts;
      }

      return sortBy(
        sortColumn,
        sortDirection,
      )(
        search
          ? filteredProducts.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
          : filteredProducts,
      );
    }
    return fakeItemsFactory(allProducts, isLoading, id => ({ id }), 10);
  }, [isLoading, allProducts, restrictedProductIds, search, filterId, sortColumn, sortDirection]);

  const handleBulkCheckbox = useCallback(
    isAllRestricted => {
      if (isAllRestricted) {
        setRestrictedProductIds(products.filter(({ id }) => id !== defaultProductId).map(product => product.id));
        return;
      }
      setRestrictedProductIds([]);
    },
    [defaultProductId, products],
  );
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box width="47.5%" mt={2}>
          <TextField
            variant="outlined"
            label="Search swag"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DashboardIcon icon={['fas', 'search']} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Box>
        <Box width="50%">
          <SelectFilter
            fullWidth
            margin="normal"
            variant="outlined"
            onFilterChange={onFilterChange}
            renderItems={() =>
              filterMenu.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.text}
                </MenuItem>
              ))
            }
            value={filterId}
            name="sort"
            label=""
          />
        </Box>
      </Box>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="none" className={classes.tableHeaderCell} size="small">
                <Checkbox
                  color="primary"
                  checked={restrictedProductIds.length + 1 !== productTypes.length} // +1 is excluded defaultProduct
                  onChange={() => handleBulkCheckbox(restrictedProductIds.length + 1 !== productTypes.length)}
                />
              </TableCell>
              <TableCell padding="none" className={classes.tableHeaderCell}>
                <TableSortLabel direction={sortDirection} active={sortColumn === 'name'} onClick={() => onSort('name')}>
                  SWAG ITEM
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" className={classes.tableHeaderCell}>
                <TableSortLabel
                  direction={sortDirection}
                  active={sortColumn === 'price'}
                  onClick={() => onSort('price')}
                >
                  PRICE ($)
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" className={classes.tableHeaderCell} />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow
                hover
                className={product.id === defaultProductId ? classes.defaultProductId : undefined}
                key={product.id}
                onMouseEnter={() => setHoveredGift(product.id)}
                onMouseLeave={() => setHoveredGift(0)}
              >
                <TableCell padding="none" scope="row">
                  <TableLoadingLabel
                    maxWidth={400}
                    pr={2}
                    isLoading={isLoading}
                    render={() => (
                      <Checkbox
                        color="primary"
                        onChange={() => handleCheckBox(product.id)}
                        checked={restrictedProductIds.indexOf(product.id) < 0}
                        disabled={product.id === defaultProductId}
                      />
                    )}
                  />
                </TableCell>
                <TableCell padding="none">
                  <TableLoadingLabel
                    maxWidth={400}
                    pr={2}
                    isLoading={isLoading}
                    render={() => (
                      <Box display="flex" alignItems="center">
                        <img src={product.image} alt={product.name} width="30" height="30" />
                        <Box ml={1}>{product.name}</Box>
                      </Box>
                    )}
                  />
                </TableCell>
                <TableCell padding="none" align="center">
                  <TableLoadingLabel maxWidth={400} pr={2} isLoading={isLoading} render={() => product.price} />
                </TableCell>
                <TableCell padding="none">
                  <Box width="85px">
                    {product.id === defaultProductId ? (
                      <Box className="Body-Small-Inactive">Selected as the default gift</Box>
                    ) : (
                      <TableLoadingLabel
                        maxWidth={400}
                        pr={2}
                        isLoading={isLoading}
                        render={() =>
                          hoveredGift === product.id &&
                          restrictedProductIds.indexOf(hoveredGift) < 0 && (
                            <Box className={classes.textButton} onClick={() => setDefaultProductId(product.id)}>
                              Select as the default gift
                            </Box>
                          )
                        }
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={3} pl={0}>
        <ActionButton
          width={100}
          onClick={() => {
            onSave({ restrictedProductIds, defaultProductId });
          }}
          disabled={isLoading}
        >
          Save
        </ActionButton>
      </Box>
    </>
  );
};

SwagRestrictedTypes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  productTypes: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  restrictedProducts: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  defaultProduct: PropTypes.number,
};

SwagRestrictedTypes.defaultProps = {
  restrictedProducts: [],
  defaultProduct: 0,
};

export default SwagRestrictedTypes;
