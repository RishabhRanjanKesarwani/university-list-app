import { Button, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const image = 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Container sx={{ paddingTop: '24px', paddingBottom: '24px' }} >
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <img src={image} alt="404 image" width={300} />
        <Typography variant="h3">Page not found!</Typography>
        <Typography variant="subtitle1" sx={{ maxWidth: '450px' }}>You landed on a route which does not exist. Please go to one of the following routes to use the application.</Typography>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row', md: 'row', lg: 'row' }} >
          <Button variant="contained" size="small" onClick={() => navigate('/')}>Home</Button>
          <Button variant="contained" size="small" onClick={() => navigate('/list')}>University List</Button>
          <Button variant="contained" size="small" onClick={() => navigate('/subscribe')}>Subscribe</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default PageNotFound;