import { AlertColor, Avatar, Button, Card, CardContent, Chip, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import { getFromStorage, setIntoStorage, subscriptionStorage } from '../utils/storage';

interface Toast {
  [key: string]: {
    severity: AlertColor,
    message: string,
  }
}

const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const emailToastMessages: Toast = {
  success: {
    severity: 'success',
    message: 'You have successfully subscribed!',
  },
  failure: {
    severity: 'error',
    message: 'Some network error occurred.',
  },
  invalid: {
    severity: 'error',
    message: 'Please input a valid email eddress.',
  },
  duplicate: {
    severity: 'info',
    message: 'You have already subscribed with this email.',
  },
};

const Subscribe = () => {
  const [email, setEmail] = useState<string>('');
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      setSubscribers(getFromStorage(subscriptionStorage));
      // TODO: Change this localstorage to API call
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subscribe = () => {
    if (!emailPattern.test(email)) {
      setSubscribeStatus('invalid');
    } else if (subscribers.includes(email)) {
      setSubscribeStatus('duplicate');
    } else {
      setIsLoading(true);
      try {
        setIntoStorage(subscriptionStorage, [...subscribers, email]);
        // TODO: Change this localstorage to API call
        setSubscribers([...subscribers, email]);
        setSubscribeStatus('success');
      } catch (error) {
        console.error(error);
        setSubscribeStatus('failure');
      } finally {
        setIsLoading(false);
      }
    }
    setShowToast(true);
  };

  // For toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'success' | 'failure' | 'invalid' | 'duplicate'>('invalid');

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };

  return (
    <Card>
      <CardContent sx={{ height: '100vh' }}>
        <Stack spacing={5}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={9}>
              <TextField fullWidth label="Email" variant="outlined" size="small" value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="contained" size="large" disabled={!email || isLoading} onClick={subscribe}>Subscribe</Button>
            </Grid>
          </Grid>
          <Container sx={{ textAlign: 'left' }}>
            <Typography variant="h4">Subscribers</Typography>
            {isLoading ? <Typography variant="overline">Loading...</Typography> : subscribers.map(sub => <Chip key={sub} avatar={<Avatar>{sub.charAt(0).toUpperCase()}</Avatar>} label={sub} sx={{ marginRight: '4px', marginBottom: '4px' }} />)}
            {!isLoading && subscribers.length === 0 && <Typography variant="subtitle1">There are no subscribers yet. Add your email to be the first subscriber!</Typography>}
          </Container>
        </Stack>
      </CardContent>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={emailToastMessages[subscribeStatus].severity} sx={{ width: '100%' }}>
          {emailToastMessages[subscribeStatus].message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default Subscribe;
