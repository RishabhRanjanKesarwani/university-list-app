import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { AlertColor, Button, Card, CardContent, Container, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Alert from '../components/Alert';
import { favouriteStorage, getFromStorage, setIntoStorage } from '../utils/storage';

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
    message: 'The university was successfully added to your favourites!',
  },
  failure: {
    severity: 'error',
    message: 'Some network error occurred.',
  },
  duplicate: {
    severity: 'info',
    message: 'The university was already present in your favourites!',
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

const defaultCountry = 'India';

const image = 'https://img.freepik.com/free-vector/no-data-illustration-concept_108061-573.jpg';

const EmptyState = () => {
  return (
    <Container >
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <img src={image} alt="Zero favourites image" width={300} />
        <Typography variant="h3">No data found!</Typography>
        <Typography variant="subtitle1" sx={{ maxWidth: '450px' }}>There is no data corresponding to the name and the country you entered above. Please change your inputs to try again.</Typography>
      </Stack>
    </Container>
  )
};

const List = () => {
  const [uniName, setUniName] = useState<string>('');
  const [country, setCountry] = useState<string>(defaultCountry); // Set default country
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUniversities = (searchName: string, searchCountry: string) => {
    setIsLoading(true);
    fetch(`http://universities.hipolabs.com/search?name=${searchName}&country=${searchCountry}`).then(res => res.json()).then((response: University[]) => {
      setIsLoading(false);
      const sortedUniversities = sortByNameAndCountry(response);
      setUniversities(sortedUniversities);
    }, error => {
      setIsLoading(false);
      console.error(error);
    })
  }

  useEffect(() => {
    fetchUniversities('', defaultCountry);
  }, []);

  const delayedSearch = useCallback(
    debounce(
      (name: string, ctry: string) => {
        fetchUniversities(name, ctry);
      }, 500
    ), []
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniName(event.target.value);
    delayedSearch(event.target.value, country);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value);
    delayedSearch(uniName, event.target.value);
  };

  const addToFavourites = (university: University) => {
    const favourites: University[] = getFromStorage(favouriteStorage);
    if (favourites.findIndex(fav => fav.name === university.name) > -1) {
      setAddStatus('duplicate');
    } else {
      try {
        setIntoStorage(favouriteStorage, [...getFromStorage(favouriteStorage), university])
        setAddStatus('success');
      } catch (error) {
        console.error(error);
        setAddStatus('failure');
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
  const [addStatus, setAddStatus] = useState<'success' | 'failure' | 'duplicate'>('failure');

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };

  return (
    <Card>
      <CardContent sx={{ height: '100vh' }}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
          <TextField label="Name" variant="outlined" value={uniName} onChange={handleNameChange} />
          <TextField label="Country" variant="outlined" value={country} onChange={handleCountryChange} />
        </Stack>
        {isLoading ?
          <Typography variant="overline">Loading...</Typography> :
          universities.length > 0 ?
            (<Paper sx={{ width: '100%' }}>
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
                              <Button variant="outlined" onClick={() => addToFavourites(row)}>Add to favourites</Button>
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
            </Paper>) : <EmptyState />
        }
      </CardContent>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={favouriteToastMessages[addStatus].severity} sx={{ width: '100%' }}>
          {favouriteToastMessages[addStatus].message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default List;
