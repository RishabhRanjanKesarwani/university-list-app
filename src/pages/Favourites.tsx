import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { AlertColor, Button, Card, CardContent, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Alert from '../components/Alert';
import { favouriteStorage, getFromStorage, setIntoStorage } from '../utils/storage';
import { useNavigate } from "react-router-dom";

interface Toast {
  [key: string]: {
    severity: AlertColor,
    message: string,
  }
}

type University = {
  name: string;
  country: string;
  domains: string[];
  isFavourite?: boolean;
}

type Column = {
  id: 'name' | 'country' | 'domains' | 'isFavourite';
  label: string;
  width?: number;
}

const columns: Column[] = [
  {
    id: 'name',
    label: 'University Name',
    width: 250,
  },
  {
    id: 'country',
    label: 'Country',
    width: 120,
  },
  {
    id: 'domains',
    label: 'Website',
    width: 200,
  },
  {
    id: 'isFavourite',
    label: '',
    width: 200
  }
]

const favouriteToastMessages: Toast = {
  success: {
    severity: 'success',
    message: 'The university was successfully removed from your favourites!',
  },
  failure: {
    severity: 'error',
    message: 'Some network error occurred.',
  },
  absent: {
    severity: 'info',
    message: 'The university is already absent from your favourites!',
  },
};

const sortByNameAndCountry = (arr: University[]) => {
  const uniByCountry: { [key: string]: University[] } = {};
  arr.forEach((item, index) => {
    const { name, country, domains } = item;
    const obj = {
      id: `uni${index}`,
      name,
      country,
      domains,
      isFavourite: false,
    }
    if (uniByCountry[country]) {
      uniByCountry[country].push(obj);
    } else {
      uniByCountry[country] = [obj];
    }
  })
  let sortedArray: University[] = []
  Object.keys(uniByCountry).sort().forEach(ctry => {
    const sortedUniPerCountry = uniByCountry[ctry].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    })
    sortedArray = [...sortedArray, ...sortedUniPerCountry];
  })
  return sortedArray;
}

const List = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const univ = getFromStorage(favouriteStorage);
      setUniversities(sortByNameAndCountry(univ));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromFavourites = (university: University) => {
    if (universities.findIndex(fav => fav.name === university.name) === -1) {
      setRemoveStatus('absent');
    } else {
      try {
        const newFavourites = [...universities.filter(uni => uni.name !== university.name)]
        setIntoStorage(favouriteStorage, newFavourites);
        setUniversities(newFavourites);
        setRemoveStatus('success');
      } catch (error) {
        console.error(error);
        setRemoveStatus('failure');
      }
    }
    setShowToast(true);
  }

  // For table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // For toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [removeStatus, setRemoveStatus] = useState<'success' | 'failure' | 'absent'>('failure');

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };

  const navigate = useNavigate();

  const EmptyState = () => {
    return (
      <>
        <Typography variant="subtitle1" sx={{ width: '100%' }}>You have not added any favourites yet. Go to university list to add your favourites.</Typography>
        <Button variant="contained" size="small" onClick={() => navigate('/list')}>University List</Button>
      </>
    )
  };

  return (
    <Card>
      <CardContent sx={{ height: '100vh' }}>
        {isLoading ?
          <Typography variant="overline">Loading...</Typography> :
          universities.length > 0 ? (
            <Paper sx={{ width: '100%' }}>
              <TableContainer sx={{ height: 550 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ top: 57, width: column.width }}
                        >
                          <Typography variant="h6">{column.label}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {universities
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        return (
                          <TableRow role="checkbox" tabIndex={-1} key={row.name}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.country}</TableCell>
                            <TableCell>
                              {row.domains.map(domain => (
                                <Typography component="a" href={`https://${domain}`} target="_blank" key={domain}>{domain}</Typography>
                              ))}
                            </TableCell>
                            <TableCell>
                              <Button variant="outlined" onClick={() => removeFromFavourites(row)}>Remove from favourites</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={universities.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          ) : (<EmptyState />)
        }
      </CardContent>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={favouriteToastMessages[removeStatus].severity} sx={{ width: '100%' }}>
          {favouriteToastMessages[removeStatus].message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default List;
